export const show = (payload = {}) => {
    window.dispatchEvent(new CustomEvent('Show_Preloader', { detail: payload }));
};

export const hide = () => {
    window.dispatchEvent(new CustomEvent('Hide_Preloader'));
};