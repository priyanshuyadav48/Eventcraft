import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Toast configuration is now handled by the ToastContainer in App.jsx
const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Success notification
export const showSuccess = (message) => {
  toast.success(message, {
    ...defaultOptions,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// Error notification
export const showError = (message) => {
  toast.error(message, {
    ...defaultOptions,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// Info notification
export const showInfo = (message) => {
  toast.info(message, {
    ...defaultOptions,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
};
