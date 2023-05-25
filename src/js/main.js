!(function(){
	if(typeof window.PTOP !== 'number') {
		window.PTOP = window.top.innerHeight - 40;
	}
	let currentDocument = null,
		file;
	const params = window.location.search.replace('?','').split('&').reduce((p,e) =>{
			const a = e.split('=');
			p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
			return p;
		},{}),
		st = window.location.origin + '/',
		title = document.getElementById('title'),
		download = document.getElementById('download'),
		fl = params['file'] ? params['file'].replace(/^\/?/, '') : false,
		docxOptions = Object.assign(docx.defaultOptions, {
			breakPages: true,
			className: "docx",
			debug: false,
			experimental: true,
			ignoreFonts: false,
			ignoreHeight: false,
			ignoreLastRenderedPageBreak: false,
			ignoreWidth: false,
			inWrapper: true,
			renderChanges: false,
			renderEndnotes: true,
			renderFooters: true,
			renderFootnotes: true,
			renderHeaders: true,
			trimXmlDeclaration: false,
			useBase64URL: false,
			useMathMLPolyfill: false
		}),
		container = document.querySelector("#document-container"),
		loadFile = function(url) {
			return new Promise((responce, reject) => {
				fetch(url)
					.then( res => res.blob() )
					.then( blob => {
						//var file = window.URL.createObjectURL(blob);
						responce(blob);
					})
					.catch((err) => {
						reject(err);
					});
			})
		},
		renderDocx = function(url) {
			currentDocument = url; 
			if (!currentDocument) 
				return;
			loadFile(url)
				.then((data) => {
					docx.renderAsync(data, container, null, docxOptions).then((x) => {
						//renderThumbnails(container, document.querySelector("#thumbnails-container"));
						window.dispatchEvent(new Event('resize'));
						window.top.dispatchEvent(new Event('resize'));
						docx.praseAsync(data).then((p) => {
							try {
								if(p.corePropsPart.props.title) {
									title.innerHTML = document.getElementsByTagName('title')[0].innerHTML = p.corePropsPart.props.title;
									download.setAttribute('download', p.corePropsPart.props.title + '.docx');
								}
								download.setAttribute("href", file);
							}catch(err){
								console.log(err);
							}
						});
					}).catch((err) => {
						container.classList.add('error-load');
						//"document-container"
						container.innerHTML = `Ошибка загрузки файла: ${file}`
					}); 
				})
				.catch((err) => {
					console.log(err);
					container.classList.add('error-load');
					container.innerHTML = `Ошибка загрузки файла: ${file}`
				});
		};
	if(fl) {
		file = /^((?:http|https|ftp):\/\/)/.test(fl) ? fl : st + fl;
		title.innerHTML = document.getElementsByTagName('title')[0].innerHTML = file.split('/').at(-1);
		renderDocx(file);
	}
}());