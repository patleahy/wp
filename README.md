# Wilbrton Pottery

This is a site I created for my wife's family's business, [WilburtonPottery.com](http://www.wilburtonpottery.com).

The site is built using Express/Node.js with Pug templates and React on the client.

The site has two interesting pages. [The store](http://www.wilburtonpottery.com/store) displays items from an Etsy store. 
This was originally generated at page load using a REST API which in turn called the Etsy API. 
That proved too slow. A Python cron job now runs every 15 minutes and creates the same JSON file as the slow API was returning. 
You can see the Python script in the [wp-gen project](https://github.com/patleahy/wp-gen/blob/master/store/main.py).

The other interesting page is [the gallery](http://www.wilburtonpottery.com/custom). This page shows custom items which Wilburton Pottery have made over the years. 
The images and descriptions for the Gallery are stored in an AWS S3 bucket. The gallery pages were created using the S3 APIs. 
However, like the store that was too slow so a [Python script](https://github.com/patleahy/wp-gen/blob/master/custom/main.py) us used to generate static pages. 
This is manually run after new images are uploaded to the S3 bucket.

---

This work is Copyright 2017 © Pat Leahy [pat@patleahy.com](mailto:patleahy.com) and [Wilburton Pottery](http://www.wilburtonpottery.com).

It is shown here only as an example the work of Pat Leahy.
