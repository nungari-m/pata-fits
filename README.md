# Pata Fits

Pata Fits is a website for buying and selling thrifted clothes.You can browse items, add them to a cart, place an order and track the order status.

## Links
- Live site: <>
- API: <>/items
- Design (Figma): <>
- Project board: <>

## Wireframe
[Open the Pata Fits wireframe in Figma](https://www.figma.com/design/yhvM5G09X0n5rjFCqqJc5K/Pata-Fits-Wireframe?node-id=47-11&t=LKVsSuGzrSbmTwZl-1)

## What the project does
- Shows all clothing items and lets you filter by category
- Lets you add, edit, and delete items
- Lets you add items to a cart and place an order
- Lets you track an order: Pending, Confirmed, Ready, Completed
- Checks form input and shows error messages
- Works on desktop, tablet and mobile

## Technologies used
- HTML, CSS, JavaScript
- json-server (the backend API)
- Jest (testing)
- GitHub Pages and Render (hosting)

## How to run it
1. Clone the project:
  `git clone https://github.com/nungari-m/pata-fits.git`
2. Install packages: `npm install`
3. Start the API: `npm start`
4. Open `index.html` with VS Code Live Server
5. Run the tests: `npm test`

## API endpoints
| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | /items | Get all items |
| POST | /items | Add an item |
| PUT | /items/:id | Edit an item |
| PATCH | /items/:id | Mark an item as sold |
| DELETE | /item/:id | Delete an item |
| GET | /orders | Get all orders |
| POST | /orders | Place an order |
| PATCH | /orders/:id | Change order status |
| DELETE | /orders/:id | Delete an order |

## Note
The API is hosted on a free plan, so it can take about a minute to wake up. Data may also reset when the server restarts.

## Author
Martha Nungari, Moringa School

## License
MIT