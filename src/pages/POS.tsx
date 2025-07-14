import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, ShoppingCart, User, Calculator, Receipt } from 'lucide-react';
import { Product, CartItem, Client } from '../types';
import { useApi } from '../hooks/useApi';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const POS: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [remiseGlobale, setRemiseGlobale] = useState(0);
  const [tva, setTva] = useState(20);
  const [typePaiement, setTypePaiement] = useState<'cash' | 'card' | 'check'>('cash');

  const { data: products, loading: productsLoading } = useApi<Product[]>('http://wadoud.com/api/produits');
  const { data: clients } = useApi<Client[]>('http://wadoud.com/api/clients');

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codeBar.includes(searchTerm)
  ) || [];

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product,
        quantity: 1,
        prix: product.prixVente,
        remise: 0
      }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const updateItemRemise = (productId: number, remise: number) => {
    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, remise }
        : item
    ));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const itemTotal = item.quantity * item.prix;
      const itemRemise = itemTotal * (item.remise / 100);
      return sum + (itemTotal - itemRemise);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const remise = subtotal * (remiseGlobale / 100);
    const subtotalAfterRemise = subtotal - remise;
    const tvaAmount = subtotalAfterRemise * (tva / 100);
    return subtotalAfterRemise + tvaAmount;
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Le panier est vide');
      return;
    }

    // Simulation de la vente
    const sale = {
      clientId: selectedClient?.id,
      items: cart,
      total: calculateTotal(),
      tva,
      remiseGlobale,
      typePaiement,
      dateVente: new Date().toISOString()
    };

    console.log('Vente:', sale);
    toast.success('Vente enregistrée avec succès');
    setCart([]);
    setSelectedClient(null);
    setRemiseGlobale(0);
  };

  if (productsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full flex">
      {/* Produits */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00809D] focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => addToCart(product)}
            >
              <div className="flex flex-col h-full">
                <div className="bg-gray-100 rounded-lg p-4 mb-3 flex items-center justify-center h-24">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.referance}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold text-[#00809D]">{product.prixVente} MAD</span>
                  <span className="text-sm text-gray-500">Stock: {product.quantite}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panier */}
      <div className="w-96 bg-white border-l border-gray-200 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Panier</h2>
          <ShoppingCart className="h-6 w-6 text-[#00809D]" />
        </div>

        {/* Client Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
          <select
            value={selectedClient?.id || ''}
            onChange={(e) => {
              const client = clients?.find(c => c.id === parseInt(e.target.value));
              setSelectedClient(client || null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00809D] focus:border-transparent"
          >
            <option value="">Client anonyme</option>
            {clients?.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {cart.map((item) => (
            <div key={item.product.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="font-medium">{item.prix} MAD</span>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Remise %"
                  value={item.remise}
                  onChange={(e) => updateItemRemise(item.product.id, parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Remise globale %:</label>
            <input
              type="number"
              value={remiseGlobale}
              onChange={(e) => setRemiseGlobale(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1 border border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">TVA %:</label>
            <input
              type="number"
              value={tva}
              onChange={(e) => setTva(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1 border border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Paiement:</label>
            <select
              value={typePaiement}
              onChange={(e) => setTypePaiement(e.target.value as 'cash' | 'card' | 'check')}
              className="flex-1 px-2 py-1 border border-gray-300 rounded"
            >
              <option value="cash">Espèces</option>
              <option value="card">Carte</option>
              <option value="check">Chèque</option>
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sous-total:</span>
            <span>{calculateSubtotal().toFixed(2)} MAD</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-[#00809D]">{calculateTotal().toFixed(2)} MAD</span>
          </div>
        </div>

        <Button
          onClick={handleCheckout}
          className="w-full mt-4"
          icon={Receipt}
          size="lg"
        >
          Finaliser la vente
        </Button>
      </div>
    </div>
  );
};

export default POS;