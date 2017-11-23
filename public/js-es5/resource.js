// 加载资源
var resourceHelper = {
  imageLoader: function(src, callback) {
    var image = new Image();
    // 图片加载完成
    image.addEventListener('load', callback);
    image.addEventListener('error', function() {
      console.log('iamgerror');
    });
    image.src = src;
    return image;
  },
  getImage: function(imageName) {
    return  this.resources.images[imageName];
  },
  load: function(resources, callback) {
    var images = resources.images;
    var sounds = resources.sounds;
    var total = images.length;
    var finish = 0;
    this.resources = {
      images: {},
      sounds: {}
    };
    var self = this;

    // 遍历加载图片
    for(var i = 0 ; i < images.length; i++) {
      var name = images[i].name;
      var src = images[i].src;
      self.resources.images[name] = self.imageLoader(src, function() {
        // 加载完成
        finish++;
        if( finish == total){
          //全部加载完成
          callback(self.resources);
        }
      });
    }
  }
}

