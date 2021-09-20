function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(e,n,r,t){if(!(e instanceof Error))throw e;if(!("undefined"==typeof window&&n||t))throw e.message+=" on line "+r,e;var o,a,i,s;try{t=t||require("fs").readFileSync(n,{encoding:"utf8"}),o=3,a=t.split("\n"),i=Math.max(r-o,0),s=Math.min(a.length,r+o)}catch(t){return e.message+=" - could not read from "+n+" ("+t.message+")",void pug_rethrow(e,null,r)}o=a.slice(i,s).map(function(e,n){var t=n+i+1;return(t==r?"  > ":"    ")+t+"| "+e}).join("\n"),e.path=n;try{e.message=(n||"Pug")+":"+r+"\n"+o+"\n\n"+e.message}catch(e){}throw e}function x(){};

export default function sidebarComponent(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;pug_debug_line = 1;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_html = pug_html + "\u003Cdiv class=\"sidebar col\" id=\"sidebar\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_html = pug_html + "\u003Cdiv class=\"sidebar-menu\"\u003E";
;pug_debug_line = 3;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"] = pug_interp = function(title, img_href){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 4;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_html = pug_html + "\u003Cdiv class=\"sidebar-item row\"\u003E";
;pug_debug_line = 5;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", 'static/img/sidebar-icons/' + img_href, true, false)) + "\u002F\u003E";
;pug_debug_line = 6;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 6;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = title) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 8;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"]("Популярное", "star.png");
;pug_debug_line = 9;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"]("Новое", "clock.png");
;pug_debug_line = 10;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"]("Подписки", "subscribes.png");
;pug_debug_line = 11;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"]("Мероприятия", "calendar.png");
;pug_debug_line = 12;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"]("Группы", "group.png");
;pug_debug_line = 13;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"]("Трансляции", "camera.png");
;pug_debug_line = 15;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_html = pug_html + "\u003Cdiv class=\"sidebar-line\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 17;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"]("IT-Новости", "question.png");
;pug_debug_line = 18;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"]("UX-Дизайн", "question.png");
;pug_debug_line = 19;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"]("Финансы", "question.png");
;pug_debug_line = 20;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"]("Техника", "question.png");
;pug_debug_line = 21;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"]("Медиа", "question.png");
;pug_debug_line = 22;pug_debug_filename = "dev\u002Fcomponents\u002Fsidebar.pug";
pug_mixins["sidebar-item"]("Торговля", "question.png");
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}