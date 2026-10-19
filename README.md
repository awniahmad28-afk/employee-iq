# Nitaq Al-A'mal — website

Static website for **Nitaq Al-A'mal (نطاق الأعمال)**, a Business Process Outsourcing & integrated business support company, powered by **Employ IQ**.

No build step — plain HTML, CSS and JavaScript. Open `index.html` in a browser, or upload the folder to any static host (GitHub Pages, Netlify, Vercel, cPanel…).

## Pages

| File | Contents |
| --- | --- |
| `index.html` | Hero, services carousel, "what's included" tabs, why us, how we help, industries, about & mission, Employ IQ group, quote request form, footer |
| `careers.html` | Why join us, two ways to apply, hiring process, roles we recruit for, CV form |

## Update contact details (one place)

Edit the `CONFIG` object at the top of `assets/js/main.js`:

```js
const CONFIG = {
  phoneDisplay: "+964 770 000 0000",
  phoneTel: "+9647700000000",
  whatsapp: "9647700000000",   // digits only, used by all WhatsApp buttons and forms
  email: "info@nitaq-alamal.com",
  address: "Baghdad, Iraq",
  employIqUrl: "#",
  social: { facebook: "#", instagram: "#", linkedin: "#" },
};
```

Every phone number, email, address, WhatsApp button and social icon on both pages is filled in from here.

## Forms

The quote form and the CV form open WhatsApp with the visitor's answers already written into the message (sent to `CONFIG.whatsapp`). Job seekers are asked to attach their CV in the chat.

## Placeholders to replace

- Contact details in `CONFIG` (above)
- The three "Why us" figures in `index.html` (`7`, `1`, `100%`) — swap for real numbers such as years in business or staff deployed
- Illustrations are inline SVG; to use real photos, replace the `<svg>` inside any `.framed__tile` with an `<img>`

## Assets

- `assets/img/nitaq-logo.png` / `nitaq-logo-white.png` — main logo (navy / white for the dark footer)
- `assets/img/employiq-logo.png` — "Powered by Employ IQ" badge in the footer
- `assets/img/favicon.png`, `apple-touch-icon.png`
