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

**Testing:** The front-end does not have automated tests yet. Back-end tests are described below.

### Back-end

Express.js server. It uses hard-coded mock data for now, until we add a database.

**Requirements:** Node.js 20 or newer.

```bash
cd back-end
npm install
npm start
```

The server runs at `http://localhost:3000`. To try a route, open `http://localhost:3000/api/items/item-1` in your browser.

**Testing:** The back-end uses mocha and chai for unit tests.

```bash
cd back-end
npm test
```

This runs all the tests in `back-end/test/` and prints a code coverage table at the end.

### Running the whole app

The front-end gets its data from the back-end, so you need both running at the same time, in two separate terminals:

1. In the first terminal, start the back-end: `cd back-end`, then `npm start`
2. In the second terminal, start the front-end: `cd front-end`, then `npm run dev`
3. Open the URL Vite prints (typically `http://localhost:5173`)

## Additional Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md)
