import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Store, User, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const schema = yup.object({
  login: yup.string().required('Le nom d\'utilisateur est requis'),
  password: yup.string().required('Le mot de passe est requis'),
});

type FormData = yup.InferType<typeof schema>;

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      toast.success('Connexion réussie');
    } catch (error) {
      toast.error('Identifiants invalides');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCECDD] to-[#F3A26D] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00809D] rounded-full mb-4">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Maktabati</h1>
            <p className="text-gray-600 mt-2">Système de gestion de caisse</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('login')}
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00809D] focus:border-transparent"
                  placeholder="Entrez votre nom d'utilisateur"
                />
              </div>
              {errors.login && (
                <p className="mt-1 text-sm text-red-600">{errors.login.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00809D] focus:border-transparent"
                  placeholder="Entrez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00809D] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#006b84] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2024 Maktabati. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;