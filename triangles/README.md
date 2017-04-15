# Triangle Visualization

This is a small interesting visualization that I built after I was inspired by the wonderful game [Kami 2](https://itunes.apple.com/us/app/kami-2/id1133161444?mt=8).

The code is currently quite messy, and could use some refactoring.


## Building

To set up the environment, go into the `triangles/` directory, and run `npm install`. This will install all the necessary dependencies into the local `node_modules` folder. You'll likely also need to install `typescript` and possibly some other things that I forgot about. Eventually I'll update this readme to reflect all required dependencies.

To build, run `npm run build` or `npm run watch` to continuously build as files change.


## Parameters

It is possible to change the run parameters for the simulation. These parameters should be added to the query string in the URL. For the default values, please look at the source code. The following parameters are supported:

`repr`: Sets the initial reproduction rate. This value should be expressed as a percentage decimal, i.e. 13% is 0.13. The reproduction rate increases to 95% over the course of the simulation. It is currently not possible to change the rate at which this occurs.

`huechange`: The hue is represented as a value between `0.0` and `1.0`. The `huechange` parameter controls the variance range of the hue when creating a new cell. For instance, if a cell has a hue of `0.5`, and `huechange` is set to `0.1`, the hue of a new triangle will be between `0.4` and `0.6`.

`satchange`: The saturation is represented as a value between `0.0` and `1.0`. The `satchange` parameter controls the variance range of the saturation when creating a new cell. See the rules for `huechange` for how this works.

`minsat`: The minimum possible saturation (the lower this value is, the less vibrant the colors will be).

`maxsat`: The maximum possible saturation.

`lumdelta`: This parameter controls the rate at which the luminosity changes per second. This effectively controls how quickly triangles fade in.

`minlum`: This parameter controls the minimum luminosity. Since the luminosity goes from 1 (white) to this value, this effectively controls how dark the target colors should be.

`zoom`: The initial zoom level. The zoom is represented as the ratio of triangle size to pixels. For instance, a zoom level of `3` means that 3 triangles will fit on one pixel (in one dimension). Conversely, a zoom level of `1/3` means that 1 triangle will take up around 3 pixels.

`minzoom`: As the canvas fills up with triangles, eventually, there will be no more room to place new ones. By default, the camera will zoom out by some factor and continue drawing once the screen is full. This parameter controls what the final zoom should be, i.e. when we should stop zooming out and let the screen be full.


## Disclaimer

I am not responsible for anything that happens during building or running this software. Use at your own risk.
