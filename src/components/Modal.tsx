import { CheckCircle, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const Modal = ({ isOpen, onClose, message }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full p-4 mb-4 shadow-lg">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#1a4d6d] mb-2">Success!</h3>
          <p className="text-gray-600 mb-6 text-sm">{message}</p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-[#1a4d6d] to-[#2563a5] text-white px-8 py-3 rounded-lg hover:from-[#2563a5] hover:to-[#1a4d6d] transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
