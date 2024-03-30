import { marked } from 'marked';

// Override function
const renderer = {
  heading(text: any, level: any) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    // vertical: space-between, horizontal: center
    return `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h${level} id="${escapedText}">
                    ${text}
                </h${level}>
                <a href="#${escapedText}" style="color: #000; text-decoration: none; font-size: 1.6rem; margin-top: auto;">
                    #
                </a>
            </div>`
  },
};

marked.use({ renderer });

export { marked };
