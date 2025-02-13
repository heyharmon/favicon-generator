# Favicon Generator Node Service

## Description
This is a Node.js service that converts a PNG image into a .ico favicon file. Upload a PNG file, and the service will return a dynamically generated favicon without storing any files.

## Usage
end a POST request to /convert with a PNG file attached as file. The service will return the .ico file as a response.

## Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run locally
```bash
npm run dev
```
This will start a local server, typically on port `8080`. You can send requests to `http://127.0.0.1:8080/convert`

## License
MIT
