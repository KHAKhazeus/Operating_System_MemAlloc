<template>
  <html>
    <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <body>
      <div class="btn-group btn-group-lg" role="group" aria-label="..." style="margin-bottom: 10px">
        <button type="button" class="btn btn-secondary" id="allocate">One Allocate</button>
        <button type="button" class="btn btn-secondary" id="merge">One Merge Free</button>
        <button type="button" class="btn btn-secondary" id="consistent">Consecutive</button>
        <button type="button" class="btn btn-secondary" id="back">Back One</button>
      </div>
      <div id="app" class="container-fluid">
        <div class="row">
          <div id="my-shuffle" class="col-md-4">
          </div>
          <div class="col-md-1 my-sizer-element"></div>
          <div id="free-shuffle" class="col-md-4">
          </div>
          <div class="col-md-2">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="Firstfit" checked>
              <label class="form-check-label" for="exampleRadios1">
                First Fit
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="Bestfit">
              <label class="form-check-label" for="exampleRadios2">
                Best Fit
              </label>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
}


</script>
