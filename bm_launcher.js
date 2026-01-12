javascript: (function() {
			const HOST_ID = 'bm-launcher-host';
			const closeLauncher = () => {
				const el = document.getElementById(HOST_ID);
				if (el) {
					el.remove();
					document.body.style.overflow = '';
				}
			};
			if (document.getElementById(HOST_ID)) {
				closeLauncher();
				return
			}
			const BASE_URL =
				'https://raw.githubusercontent.com/kuba1285/vault/main/launcher.json';
			const URL = `${BASE_URL}?t=${Date.now()}`;
			fetch(URL, {
					cache: % 27 no - store % 27
				}).then(r => {
					if (!r.ok) throw new Error(`HTTP ${r.status}`);
					return r.json()
				}).then(bm => {
						const entries = Object.entries(bm);
						let selectedIndex = 0;
						let filteredEntries = entries;
						let useMouse = false;
						document.body.style.overflow = % 27 hidden % 27;
						const container = document.createElement( % 27 div % 27);
						container.id = HOST_ID;
						const style = document.createElement( % 27 style % 27);
						style.textContent =
							`#bm-overlay{position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;background:rgba(0,0,0,0.5)!important;z-index:999998!important;backdrop-filter:blur(8px)!important}#bm-launcher{position:fixed!important;top:15%!important;left:50%!important;transform:translateX(-50%)!important;width:600px!important;background:#fff!important;border-radius:12px!important;box-shadow:0 20px 40px rgba(0,0,0,0.3)!important;overflow:hidden!important;font-family:sans-serif!important;z-index:999999!important;text-align:left!important}#bm-input{width:100%!important;padding:18px 24px!important;font-size:20px!important;border:none!important;outline:none!important;background:#fff!important;color:#333!important;box-sizing:border-box!important}#bm-launcher-list{max-height:400px!important;overflow-y:auto!important;border-top:1px solid #eee!important;background:#fff!important}.bm-item{padding:12px 20px!important;display:flex!important;align-items:center!important;cursor:pointer!important;user-select:none!important;color:#333!important}.bm-item.selected{background:rgba(0,122,255,0.1)!important}.bm-key{background:#f0f0f0!important;color:#000!important;padding:2px 8px!important;border-radius:4px!important;font-weight:bold!important;margin-right:12px!important;min-width:30px!important;text-align:center!important;font-size:14px!important;display:inline-block!important}.bm-name{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:480px!important;color:#333!important;font-size:16px!important}%60;const overlay=document.createElement('div');overlay.id='bm-overlay';overlay.onclick=closeLauncher;const launcher=document.createElement('div');launcher.id='bm-launcher';const input=document.createElement('input');input.id='bm-input';input.type='text';input.placeholder='コマンド検索...（Enterで実行/コピー）';input.autofocus=true;input.autocomplete='off';const list=document.createElement('div');list.id='bm-launcher-list';launcher.appendChild(input);launcher.appendChild(list);container.appendChild(style);container.appendChild(overlay);container.appendChild(launcher);document.body.appendChild(container);let scrollInterval;const stopScroll=()=>{if(scrollInterval){clearInterval(scrollInterval);scrollInterval=null}};list.addEventListener('mousemove',e=>{useMouse=true;const rect=list.getBoundingClientRect();const y=e.clientY-rect.top;const h=rect.height;const zone=40;stopScroll();if(y<zone){scrollInterval=setInterval(()=>{list.scrollTop-=8},16)}else if(y>h-zone){scrollInterval=setInterval(()=>{list.scrollTop+=8},16)}});list.addEventListener('mouseleave',stopScroll);const render=()=>{list.replaceChildren();filteredEntries.forEach(([k,v],i)=>{const item=document.createElement('div');item.className='bm-item'+(i===selectedIndex?' selected':'');item.dataset.index=i;const keySpan=document.createElement('span');keySpan.className='bm-key';keySpan.textContent=k;const nameSpan=document.createElement('span');nameSpan.className='bm-name';nameSpan.textContent=(typeof v==='object'&&v.name)?v.name:k;item.appendChild(keySpan);item.appendChild(nameSpan);item.onmouseenter=()=>{if(useMouse&&selectedIndex!==i){selectedIndex=i;render()}};item.onclick=()=>execute(i);list.appendChild(item)});const sel=list.querySelector('.selected');if(sel&&!useMouse){sel.scrollIntoView({block:'nearest'})}};const filter=(query)=>{const q=query.toLowerCase();filteredEntries=entries.filter(([k,v])=>{const name=(typeof v==='object'&&v.name)?v.name:'';return k.toLowerCase().startsWith(q)||name.toLowerCase().startsWith(q)}).sort(([ka],[kb])=>{const a=ka.toLowerCase(),b=kb.toLowerCase();if(a===q)return -1;if(b===q)return 1;if(a.length!==b.length)return a.length-b.length;return a.localeCompare(b)});selectedIndex=0;render()};const execute=(index)=>{const[,item]=filteredEntries[index];const rawCode=(typeof item==='string'?item:item.code).replace(/^javascript:/i,'');try{let policy=window.bmPolicy;if(!policy){policy=window.trustedTypes?.createPolicy('bm-policy',{createScript:s=>s})||{createScript:s=>s};window.bmPolicy=policy}const script=document.createElement('script');script.textContent=policy.createScript(rawCode);document.head.appendChild(script);script.remove();input.value='';filter('');setTimeout(()=>input.focus(),50)}catch(e){navigator.clipboard.writeText(rawCode).then(()=>{alert('Teamsの制限により直接実行できません。コードをコピーしました。F12のコンソールに貼り付けてEnterを押してください。');input.value='';filter('');setTimeout(()=>input.focus(),50)})}};input.oninput=e=>filter(e.target.value);input.onkeydown=e=>{if(e.key==='Escape'){input.value='';closeLauncher()}if(e.key==='ArrowDown'){useMouse=false;e.preventDefault();selectedIndex=(selectedIndex+1)%filteredEntries.length;render()}if(e.key==='ArrowUp'){useMouse=false;e.preventDefault();selectedIndex=(selectedIndex-1+filteredEntries.length)%filteredEntries.length;render()}if(e.key==='Enter'&&filteredEntries.length>0){execute(selectedIndex)}};filter('');setTimeout(()=>input.focus(),50)}).catch(e=>alert('読込失敗: '+e.message))})();
