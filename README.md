## Simple image upload with react

```bash
$ yarn
$ yarn start
# in another terminal
$ yarn server
```

Open http://localhost:3000 in browser

## Gotchas

Common problems dealing with file upload and react

1. CORS
   - normally the server will be hosted on a different port than the frontend, at least in development
     - create-react-app has a proxy option to help with this
     - cors can be configured on express (but I find it doesn't tend to work out of the box)
     - the app can be built and served as part of static files (but this is usually not how people set up their dev environments)
2. file protection
   - `<input type="file" />` is read only, and can't be used as a controlled component by react
     - the `useRef` hook makes this easy to get to
     - files will always be a nodeList, so we have to select the first element
3. form data / `<form method="post" action="/image" encType="multipart/form-data">`
   - We tend to use JSON for everything API these days, but that doesn't work for files
     - (unless you convert the files in the client first, but then you might as well just send the image through the socket in the first place)
     - either let the browser handle the form submit action
     - or use `new FormData()`
   - a [neat trick / ugly hack](#hack) we found is using an iframe and target the form to that to avoid redirecting the user away from the page
4. multipart form data on the server
   - The commonly used body-parser module does not deal with advanced data like files
     - There are several packages for this, but I've found `multer` to be really easy to use

### Hack

A hack to prevent redirect when the browser handles the submit

```html
<iframe
  name="hiddenFrame"
  width="0"
  height="0"
  border="0"
  style="display: none;"
></iframe>
<form
  method="post"
  action="/image"
  enctype="multipart/form-data"
  target="hiddenFrame"
></form>
```
