# Number Spiral

A single-page interactive number countdown.

## Behaviour

The counter starts at:

**32999**

Each click anywhere on the page advances it to the next fixed checkpoint:

1. 32999
2. 30999
3. 29999
4. 27999

During the transition, the counter rolls through the numbers between checkpoints. It only **settles** on the four predefined numbers.

Once `27999` is reached, the page freezes. A browser refresh resets the experience to `32999`.

## Run locally

No build tools are required.

Open `index.html` in a browser.

For a local server, you can also run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `styles.css`, and `script.js`.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`.
6. Save.

GitHub will give you a Pages URL after deployment.

## Main settings

The fixed numbers are controlled here in `script.js`:

```js
const CHECKPOINTS = [32999, 30999, 29999, 27999];
```

Do not change this array if you want the exact four-stop experience.
