// frontend/src/styles/global.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: #000000;
    --dark-gray: #333333;
    --gray: #666666;
    --light-gray: #CCCCCC;
    --white: #FFFFFF;
    --accent-dark-gray: #444444;
    --accent-light-gray: #EEEEEE;
    --font-family: 'FK Grotesk', Arial, sans-serif;
    --font-light: 300;
    --font-regular: 400;
    --font-medium: 500;
    --font-bold: 700;
    --font-extra-bold: 900;
    --font-size-h1: 48px;
    --font-size-h2: 40px;
    --font-size-h3: 36px;
    --font-size-h4: 32px;
    --font-size-h5: 28px;
    --font-size-h6: 24px;
    --font-size-h7: 20px;
    --font-size-body1: 18px;
    --font-size-body2: 16px;
    --font-size-body3: 14px;
    --font-size-caption: 12px;
    --font-size-small-caption: 10px;
    --font-size-button: 16px;
    --font-size-small-button: 14px;
    --spacing-xx-small: 4px;
    --spacing-x-small: 8px;
    --spacing-small: 12px;
    --spacing-medium: 16px;
    --spacing-large: 24px;
    --spacing-x-large: 32px;
    --spacing-xx-large: 40px;
  }

  body {
    margin: 0;
    font-family: var(--font-family);
    background-color: var(--white);
    color: var(--dark-gray);
  }
`;

export default GlobalStyle;
