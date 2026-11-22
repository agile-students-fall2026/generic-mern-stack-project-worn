# Worn

## Product Vision Statement

**For** fashion and cost conscious people, **who** want to ensure that they're making the most of their closet, **Worn is a** digital wardrobe tracker **that** shows the cost-per-wear of every item you own.

## Description

Worn is a digital wardrobe tracker that logs what you own and how often you wear it, then calculates cost-per-wear so you can see which purchases pay off. It is based online with distinct accounts per user so they can return to their digital wardrobe easily.

## Team

| Name                | GitHub                                             |
| ------------------- | -------------------------------------------------- |
| [Manasa Thumu]      | [@mt5135](https://github.com/mt5135)               |
| [Jamie Stuart]      | [@jamiestuartv](https://github.com/jamiestuartv)   |
| [Aashin Singhal]    | [@aashinsinghal](https://github.com/aashinsinghal) |
| [Chloe Chevin Jeon] | [@chevinjeon](https://github.com/chevinjeon)       |
| [Christopher Park]  | [@joomen10](https://github.com/joomen10)           |

## History

Worn started as a semester project for Agile Development at NYU. It came from a real life problem of not having any way of tracking our closets and making sure we were actually wearing the clothes we'd bought.

## Contributing

We welcome contributions. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for our workflow, coding standards, and how to submit changes.

## Building and Testing

### Front-end

React app built with Vite, Tailwind CSS, and React Router.

**Requirements:** Node.js 20 or newer.

```bash
cd front-end
npm install
npm run dev
```

The app will be available at the local URL Vite prints in the terminal (typically `http://localhost:5173`).

**Testing:** [Add test instructions, e.g. `npm test`, once tests exist.]

### Back-end

Express serves the default images and favicon from `back-end/public`.

```bash
cd back-end
npm install
npm start
```

The server uses port 3000 by default (`PORT` can override it). Available files:

- `/static/images/item-placeholder.svg`
- `/static/images/default-avatar.svg`
- `/static/favicon.svg`

Run `npm test` from `back-end` for the Mocha/Chai HTTP tests and c8 coverage.
Coverage currently targets `app.js`; expand it as backend modules are added.
Run the frontend in a second terminal. Vite forwards `/static` requests to
`http://localhost:3000`; update that proxy target if you change the backend port.

## Additional Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md)
