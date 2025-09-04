const API = {
  AUTH: {
    SIGNIN: '/api/v1/auth/sign-in',
    SIGNUP: '/api/v1/auth/sign-up',
    SEND_VERIFICATION_EMAIL: '/api/v1/auth/send-verification-email',
    SEND_RESET_PASSWORD_EMAIL: '/api/v1/auth/send-reset-password-email',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
    GET_PROFILE: '/api/v1/auth/profile',
    REFRESH: '/api/v1/auth/refresh',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    SIGN_OUT: '/api/v1/auth/sign-out',
  },
  USER: {
    GET_AVATAR_URL: '/api/v1/user/avatar',
  },
  ROLE: {
    INDEX: '/api/v1/role',
    CREATE: '/api/v1/role',
  },
  PERMISSION: {
    INDEX: '/api/v1/permission',
  },
};

export default API;
