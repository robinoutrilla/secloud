
(function(context) {
  
  var baseUrl = '';
  
  var getBaseUrl = function() {
    if( !baseUrl ) {
      var scripts = document.getElementsByTagName('script');
      for( var i = 0, l = scripts.length; i < l; i++ ) {
        if( scripts[i].className == 'revolution-bookmarklet' ) {
          baseUrl = scripts[i].getAttribute('rel');
        }
      }
    }
    return baseUrl;
  }
  
  var getShareSrc = function(params) {
    if( !params ) {
      return void(0);
    }
    return getBaseUrl() + 'share' + 
      '?type=' + (params.type || 'link') +
      '&url=' + encodeURIComponent(params.url || window.location.href) + 
      '&return=' + encodeURIComponent(params.redirect || window.location.href);
  }
  
  var detectPhoto = function(params) {
    var els, i, l;
    
    els = document.getElementsByTagName('link'), i = 0, l = els.length;
    for( ; i < l; i++ ) {
      if( els[i].getAttribute('rel') == 'image_src' ) {
        params.type = 'image';
        params.url = els[i].getAttribute('href');
        return true;
      }
    }
    
    els = document.getElementsByTagName('meta'), i = 0, l = els.length;
    for( ; i < l; i++ ) {
      if( els[i].getAttribute('property') == 'og:image' ) {
        params.type = 'image';
        params.url = els[i].getAttribute('content');
        return true;
      }
    }
    
    return false;
  }
  
  var detectVideo = function(params) {
    var els = document.getElementsByTagName('meta'), i = 0, l = els.length;
    
    for( ; i < l; i++ ) {
      if( els[i].getAttribute('property') == 'og:type' && els[i].getAttribute('content') == 'video' ) {
        params.type = 'video';
        return true;
      } else if( els[i].getAttribute('og:video') ) {
        params.type = 'video';
        return true;
      }
    }
    
    return false;
  }
  
  var detect = function(url) {
    url = url || window.location.href;
    var host = url.split('/')[2], retval = {};
    retval.url = url;
    
    if( host.substring(0, 4) == 'www.' ) {
      host = host.substring(4);
    }
    
    switch( host ) {
      // Image
      case 'imgur.com':
      case 'instagr.am':
        detectPhoto(retval);
        break;
      // Video
      case 'vimeo.com':
      case 'youtube.com':
        detectVideo(retval);
        break;
    }
    
    return retval;
  }
  
  var redirect = getShareSrc(detect());
  if( redirect ) {
    window.location.assign(redirect);
  }
  
})(window);
