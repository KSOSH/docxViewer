!(function($){
	$(document).on('click', "a[href$='.docx']", function(e){
		let base = window.location.origin + '/',
			reg = new RegExp("^" + base),
			href = this.href,
			test = this.href,
			go = false;
		if(!$(this).data('google') && reg.test(href)){
			href = href.replace(base, '');
			let arr = href.split('.'),
				ext = arr.at(-1).toLowerCase();
			switch(ext){
				case 'docx':
					go = window.location.origin + '/viewer/docx_viewer/index.html?file=' + test;
					$(this).data('google', go);
					$(this).data('type', 'iframe');
					break;
			}
		}
		let gl = $(this).data('google');
		if(reg.test(test) && gl){
			e.preventDefault();
			test = $(this).data('google');
			let options = {
				src: test,
				opts : {
					afterShow : function( instance, current ) {
						$(".fancybox-content").css({
							height: '100% !important',
							overflow: 'hidden'
						}).addClass('docx_viewer');
					},
					afterLoad : function( instance, current ) {
						$(".fancybox-content").css({
							height: '100% !important',
							overflow: 'hidden'
						}).addClass('docx_viewer');
					},
				}
			};
			if($(this).data('type')){
				options.type = $(this).data('type');
			}
			$.fancybox.open(options);
			return false;
		}
	})
}(jQuery))