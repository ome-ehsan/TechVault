import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react'; // Changed icon

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="space-y-6">
          <XCircle className="h-16 w-16 text-red-400 mx-auto" /> 
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Payment Failed!
          </h1>
          <p className="text-gray-400 text-lg">
            There was an issue processing your payment. Try again.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              to="/checkout"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Try Again
            </Link>
            
            <Link
              to="/"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-100 rounded-lg transition-colors font-medium"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;