function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(e,n,r,t){if(!(e instanceof Error))throw e;if(!("undefined"==typeof window&&n||t))throw e.message+=" on line "+r,e;var o,a,i,s;try{t=t||require("fs").readFileSync(n,{encoding:"utf8"}),o=3,a=t.split("\n"),i=Math.max(r-o,0),s=Math.min(a.length,r+o)}catch(t){return e.message+=" - could not read from "+n+" ("+t.message+")",void pug_rethrow(e,null,r)}o=a.slice(i,s).map(function(e,n){var t=n+i+1;return(t==r?"  > ":"    ")+t+"| "+e}).join("\n"),e.path=n;try{e.message=(n||"Pug")+":"+r+"\n"+o+"\n\n"+e.message}catch(e){}throw e}function x(){};

export default function 
            mainPagePreviewBarComponent(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;
    var locals_for_with = (locals || {});
    
    (function (authorName, authorUrl, comments, likes, tags, text, time, title) {
      ;pug_debug_line = 1;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"preview\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"preview__top\"\u003E";
;pug_debug_line = 3;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"author-time\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Ca" + (" class=\"author-time__author-name\""+pug_attr("href", `${authorUrl}`, true, false)) + "\u003E";
;pug_debug_line = 4;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = authorName) ? "" : pug_interp)) + "\u003C\u002Fa\u003E";
;pug_debug_line = 5;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"author-time__time\"\u003E";
;pug_debug_line = 5;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = time) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 6;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"preview__content\"\u003E";
;pug_debug_line = 7;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"tags\"\u003E";
;pug_debug_line = 8;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
// iterate tags.length ? tags : ['no tags']
;(function(){
  var $$obj = tags.length ? tags : ['no tags'];
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var tag = $$obj[pug_index0];
;pug_debug_line = 9;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"tags__tag preview__tag\"\u003E";
;pug_debug_line = 9;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = tag) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var tag = $$obj[pug_index0];
;pug_debug_line = 9;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"tags__tag preview__tag\"\u003E";
;pug_debug_line = 9;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = tag) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 10;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"preview__title\"\u003E";
;pug_debug_line = 10;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = title) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 11;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"preview__description\"\u003E";
;pug_debug_line = 11;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = text) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 12;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"card__bottom\"\u003E";
;pug_debug_line = 13;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"btn-more\"\u003E";
;pug_debug_line = 13;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "Read more -\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 14;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"action-btns\"\u003E";
;pug_debug_line = 15;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"icon action-btns__first\"\u003E";
;pug_debug_line = 16;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"likes icon__text\"\u003E";
;pug_debug_line = 16;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = likes) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 17;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cimg class=\"icon__img\" src=\"static\u002Fimg\u002Ficons\u002Flike.svg\"\u002F\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 18;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"icon\"\u003E";
;pug_debug_line = 19;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cdiv class=\"comments icon__text\"\u003E";
;pug_debug_line = 19;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = comments) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 20;pug_debug_filename = "dev\u002Fcomponents\u002FmainPagePreviewBar.pug";
pug_html = pug_html + "\u003Cimg class=\"icon__img\" src=\"static\u002Fimg\u002Ficons\u002Fcomment.svg\"\u002F\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
    }.call(this, "authorName" in locals_for_with ?
        locals_for_with.authorName :
        typeof authorName !== 'undefined' ? authorName : undefined, "authorUrl" in locals_for_with ?
        locals_for_with.authorUrl :
        typeof authorUrl !== 'undefined' ? authorUrl : undefined, "comments" in locals_for_with ?
        locals_for_with.comments :
        typeof comments !== 'undefined' ? comments : undefined, "likes" in locals_for_with ?
        locals_for_with.likes :
        typeof likes !== 'undefined' ? likes : undefined, "tags" in locals_for_with ?
        locals_for_with.tags :
        typeof tags !== 'undefined' ? tags : undefined, "text" in locals_for_with ?
        locals_for_with.text :
        typeof text !== 'undefined' ? text : undefined, "time" in locals_for_with ?
        locals_for_with.time :
        typeof time !== 'undefined' ? time : undefined, "title" in locals_for_with ?
        locals_for_with.title :
        typeof title !== 'undefined' ? title : undefined));
    ;} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}