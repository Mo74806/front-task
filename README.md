## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/sideup-inventory.git
cd sideup-inventory
npm install
```

## Running the App

```bash
npm run dev
```

## Running Tests

```bash
npm test
```

## Caching & Data Fetching

This project uses **React Query** for data fetching and caching. All API data (categories, products) is cached and automatically updated when you interact with the app (e.g., change category, update stock). React Query ensures efficient network usage and a responsive UI.

## Efficient List Rendering

Product lists are rendered using **react-virtuoso**, a performant virtual list component. This allows the dashboard to efficiently display large numbers of products with smooth scrolling and infinite loading.
