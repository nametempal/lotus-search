// ==UserScript==
// @name         Lotus Multi-Branch Stock Checker
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Check product stock across all Lotus's branches
// @author       Antigravity
// @match        https://www.lotuss.com/*/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lotuss.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        sellerId: 3,
        batchSize: 10,
        regions: [
            { name: "Bangkok Central", lat: 13.7563, lon: 100.5018, zip: "10100" },
            { name: "Bangkok North", lat: 13.8621, lon: 100.5144, zip: "10210" },
            { name: "Bangkok East", lat: 13.7367, lon: 100.6308, zip: "10240" },
            { name: "Bangkok West", lat: 13.7833, lon: 100.4167, zip: "10160" },
            { name: "Bangkok South", lat: 13.6833, lon: 100.5167, zip: "10120" },
            { name: "Bangkok Suvarnabhumi", lat: 13.6811, lon: 100.7470, zip: "10540" },
            { name: "Nonthaburi", lat: 13.8583, lon: 100.5145, zip: "11000" },
            { name: "Pathum Thani", lat: 14.0208, lon: 100.5256, zip: "12000" },
            { name: "Samut Prakan", lat: 13.5990, lon: 100.5998, zip: "10280" },
            { name: "Samut Sakhon", lat: 13.5475, lon: 100.2745, zip: "74000" },
            { name: "Nakhon Pathom", lat: 13.8196, lon: 100.0620, zip: "73000" },
            { name: "Ayutthaya", lat: 14.3692, lon: 100.5877, zip: "13000" },
            { name: "Saraburi", lat: 14.5289, lon: 100.9108, zip: "18000" },
            { name: "Ang Thong", lat: 14.5896, lon: 100.4553, zip: "14000" },
            { name: "Suphan Buri", lat: 14.4744, lon: 100.1177, zip: "72000" },
            { name: "Sing Buri", lat: 14.8909, lon: 100.4014, zip: "16000" },
            { name: "Lop Buri", lat: 14.7995, lon: 100.6534, zip: "15000" },
            { name: "Chai Nat", lat: 15.1853, lon: 100.1253, zip: "17000" },
            { name: "Nakhon Sawan", lat: 15.6982, lon: 100.1167, zip: "60000" },
            { name: "Uthai Thani", lat: 15.3835, lon: 100.0255, zip: "61000" },
            { name: "Kamphaeng Phet", lat: 16.4826, lon: 99.5226, zip: "62000" },
            { name: "Phichit", lat: 16.4396, lon: 100.3481, zip: "66000" },
            { name: "Phitsanulok", lat: 16.8211, lon: 100.2659, zip: "65000" },
            { name: "Phetchabun", lat: 16.4189, lon: 101.1547, zip: "67000" },
            { name: "Tak", lat: 16.8798, lon: 99.1257, zip: "63000" },
            { name: "Chiang Mai", lat: 18.7883, lon: 98.9853, zip: "50000" },
            { name: "Chiang Mai East", lat: 18.7650, lon: 99.0200, zip: "50250" },
            { name: "Chiang Mai North", lat: 19.0300, lon: 98.9700, zip: "50150" },
            { name: "Chiang Rai", lat: 19.9105, lon: 99.8406, zip: "57000" },
            { name: "Lampang", lat: 18.2888, lon: 99.4977, zip: "52000" },
            { name: "Lamphun", lat: 18.5747, lon: 99.0087, zip: "51000" },
            { name: "Phrae", lat: 18.1450, lon: 100.1408, zip: "54000" },
            { name: "Nan", lat: 18.7756, lon: 100.7730, zip: "55000" },
            { name: "Phayao", lat: 19.1665, lon: 99.9011, zip: "56000" },
            { name: "Mae Hong Son", lat: 19.3020, lon: 97.9654, zip: "58000" },
            { name: "Khon Kaen", lat: 16.4322, lon: 102.8236, zip: "40000" },
            { name: "Khon Kaen East", lat: 16.4500, lon: 102.9000, zip: "40260" },
            { name: "Udon Thani", lat: 17.4156, lon: 102.7872, zip: "41000" },
            { name: "Ubon Ratchathani", lat: 15.2448, lon: 104.8473, zip: "34000" },
            { name: "Nakhon Ratchasima", lat: 14.9799, lon: 102.0978, zip: "30000" },
            { name: "Nakhon Ratchasima N", lat: 15.1000, lon: 102.1500, zip: "30210" },
            { name: "Buriram", lat: 14.9931, lon: 103.1029, zip: "31000" },
            { name: "Surin", lat: 14.8820, lon: 103.4936, zip: "32000" },
            { name: "Sisaket", lat: 15.1186, lon: 104.3220, zip: "33000" },
            { name: "Roi Et", lat: 16.0538, lon: 103.6520, zip: "45000" },
            { name: "Maha Sarakham", lat: 16.1851, lon: 103.2998, zip: "44000" },
            { name: "Kalasin", lat: 16.4315, lon: 103.5060, zip: "46000" },
            { name: "Sakon Nakhon", lat: 17.1664, lon: 104.1486, zip: "47000" },
            { name: "Nakhon Phanom", lat: 17.3922, lon: 104.7696, zip: "48000" },
            { name: "Mukdahan", lat: 16.5432, lon: 104.7236, zip: "49000" },
            { name: "Amnat Charoen", lat: 15.8656, lon: 104.6257, zip: "37000" },
            { name: "Yasothon", lat: 15.7927, lon: 104.1452, zip: "35000" },
            { name: "Loei", lat: 17.4860, lon: 101.7223, zip: "42000" },
            { name: "Nong Khai", lat: 17.8782, lon: 102.7418, zip: "43000" },
            { name: "Nong Bua Lam Phu", lat: 17.2044, lon: 102.4424, zip: "39000" },
            { name: "Chaiyaphum", lat: 15.8068, lon: 102.0317, zip: "36000" },
            { name: "Bung Kan", lat: 18.3609, lon: 103.6461, zip: "38000" },
            { name: "Chonburi", lat: 13.3611, lon: 100.9847, zip: "20000" },
            { name: "Pattaya", lat: 12.9236, lon: 100.8825, zip: "20150" },
            { name: "Rayong", lat: 12.6814, lon: 101.2817, zip: "21000" },
            { name: "Chanthaburi", lat: 12.6111, lon: 102.1039, zip: "22000" },
            { name: "Trat", lat: 12.2428, lon: 102.5149, zip: "23000" },
            { name: "Prachinburi", lat: 14.0511, lon: 101.3660, zip: "25000" },
            { name: "Sa Kaeo", lat: 13.8240, lon: 102.0640, zip: "27000" },
            { name: "Chachoengsao", lat: 13.6904, lon: 101.0779, zip: "24000" },
            { name: "Nakhon Nayok", lat: 14.2056, lon: 101.2132, zip: "26000" },
            { name: "Kanchanaburi", lat: 14.0023, lon: 99.5328, zip: "71000" },
            { name: "Ratchaburi", lat: 13.5282, lon: 99.8134, zip: "70000" },
            { name: "Phetchaburi", lat: 13.1119, lon: 99.9399, zip: "76000" },
            { name: "Prachuap Khiri Khan", lat: 11.8126, lon: 99.7957, zip: "77000" },
            { name: "Hua Hin", lat: 12.5681, lon: 99.9578, zip: "77110" },
            { name: "Surat Thani", lat: 9.1382, lon: 99.3217, zip: "84000" },
            { name: "Surat Thani N", lat: 9.3000, lon: 99.4500, zip: "84100" },
            { name: "Nakhon Si Thammarat", lat: 8.4322, lon: 99.9633, zip: "80000" },
            { name: "Nakhon Si T South", lat: 7.9500, lon: 99.8000, zip: "80160" },
            { name: "Krabi", lat: 8.0863, lon: 98.9063, zip: "81000" },
            { name: "Phang Nga", lat: 8.4511, lon: 98.5258, zip: "82000" },
            { name: "Phuket", lat: 7.8804, lon: 98.3923, zip: "83000" },
            { name: "Phuket South", lat: 7.7500, lon: 98.3600, zip: "83130" },
            { name: "Trang", lat: 7.5593, lon: 99.6115, zip: "92000" },
            { name: "Phatthalung", lat: 7.6196, lon: 100.0740, zip: "93000" },
            { name: "Satun", lat: 6.6238, lon: 100.0674, zip: "91000" },
            { name: "Songkhla", lat: 7.1756, lon: 100.6142, zip: "90000" },
            { name: "Hat Yai", lat: 7.0084, lon: 100.4747, zip: "90110" },
            { name: "Pattani", lat: 6.8650, lon: 101.2503, zip: "94000" },
            { name: "Yala", lat: 6.5414, lon: 101.2803, zip: "95000" },
            { name: "Narathiwat", lat: 6.4254, lon: 101.8253, zip: "96000" },
            { name: "Chumphon", lat: 10.4930, lon: 99.1800, zip: "86000" },
            { name: "Ranong", lat: 9.9529, lon: 98.6085, zip: "85000" }
        ]
    };

    let state = {
        stores: [],
        results: [],
        isChecking: false,
        abortController: null,
        productName: ''
    };
    let uiElements = {};

    function getProductSlug() {
        const parts = window.location.pathname.split('/');
        return parts[parts.length - 1];
    }

    function getProductName() {
        try {
            const nd = window.__NEXT_DATA__;
            const p = nd && nd.props && nd.props.pageProps && nd.props.pageProps.productDetailSSR;
            return (p && p.name) ? p.name : 'Unknown Product';
        } catch (e) {
            return 'Unknown Product';
        }
    }

    async function fetchStoresForRegion(region) {
        const url = 'https://api-o2o.lotuss.com/lotuss-mobile-bff/cart/v5/stores/search?delivery_type=SFL&delivery_method=CCND&latitude=' + region.lat + '&longitude=' + region.lon + '&seller_id=' + CONFIG.sellerId + '&limit=200&zip_code=' + region.zip;
        try {
            const res = await fetch(url, { headers: { 'accept-language': 'en' } });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const json = await res.json();
            return (json.data && json.data.company_stores) ? json.data.company_stores : [];
        } catch (e) {
            console.error('Failed to fetch stores for ' + region.name + ':', e);
            return [];
        }
    }

    async function getAllStores() {
        const cached = sessionStorage.getItem('lotus_stores_v3');
        if (cached) {
            try { return JSON.parse(cached); } catch (e) { }
        }

        const allStoresMap = new Map();
        const promises = CONFIG.regions.map(function (r) { return fetchStoresForRegion(r); });
        const results = await Promise.all(promises);

        results.forEach(function (regionStores) {
            regionStores.forEach(function (store) {
                if (store && store.store_id) {
                    allStoresMap.set(store.store_id, {
                        id: store.store_id,
                        name: store.name_th || store.name_en || ('Store ' + store.store_id),
                        type: store.subStoreType || 'Unknown'
                    });
                }
            });
        });

        const uniqueStores = Array.from(allStoresMap.values());
        sessionStorage.setItem('lotus_stores_v3', JSON.stringify(uniqueStores));
        return uniqueStores;
    }

    async function checkStock(slug, storeId, signal) {
        const url = 'https://api-o2o.lotuss.com/lotuss-mobile-bff/product/v4/product?slug=' + slug + '&seller_id=' + CONFIG.sellerId + '&store_id=' + storeId;
        try {
            const res = await fetch(url, { signal: signal });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const json = await res.json();
            const d = json.data || json;
            return {
                storeId: storeId,
                status: d.stockStatus || 'UNKNOWN',
                qty: d.stockOnHand !== undefined ? d.stockOnHand : -1
            };
        } catch (e) {
            return { storeId: storeId, status: 'ERROR', qty: -1, error: e.message };
        }
    }

    async function asyncPool(concurrency, items, iteratorFn) {
        const executing = new Set();
        const results = [];
        for (const item of items) {
            const p = iteratorFn(item).then(function (res) {
                executing.delete(p);
                return res;
            });
            executing.add(p);
            results.push(p);
            if (executing.size >= concurrency) {
                await Promise.race(executing);
            }
        }
        return Promise.allSettled(results);
    }

    function injectStyles() {
        if (document.getElementById('lotus-stock-styles')) return;
        const style = document.createElement('style');
        style.id = 'lotus-stock-styles';
        style.innerHTML = [
            '#lotus-stock-btn {',
            '  position:fixed; bottom:20px; right:20px;',
            '  background:#00b388; color:white; border:none;',
            '  border-radius:50px; padding:12px 24px;',
            '  font-size:16px; font-weight:bold; cursor:pointer;',
            '  z-index:999998; box-shadow:0 4px 12px rgba(0,0,0,0.15);',
            '  transition:transform 0.2s;',
            '}',
            '#lotus-stock-btn:hover { transform:scale(1.05); }',
            '#lotus-stock-panel {',
            '  position:fixed; top:50px; right:50px; width:450px;',
            '  background:white; border-radius:8px;',
            '  box-shadow:0 10px 30px rgba(0,0,0,0.2);',
            '  z-index:999999; display:flex; flex-direction:column;',
            '  font-family:Arial,sans-serif; color:#333;',
            '  max-height:80vh; overflow:hidden;',
            '}',
            '#lsc-header {',
            '  background:#00b388; color:white; padding:15px;',
            '  font-weight:bold; display:flex;',
            '  justify-content:space-between; align-items:center; cursor:move;',
            '}',
            '#lsc-close { background:none; border:none; color:white; font-size:20px; cursor:pointer; }',
            '#lsc-body { padding:15px; display:flex; flex-direction:column; gap:10px; }',
            '#lsc-progress-container { width:100%; background:#eee; border-radius:4px; height:10px; overflow:hidden; }',
            '#lsc-progress-bar { height:100%; background:#00b388; width:0%; transition:width 0.2s; }',
            '#lsc-controls { display:flex; justify-content:space-between; margin-bottom:10px; font-size:14px; }',
            '#lsc-table-container { overflow-y:auto; flex-grow:1; border:1px solid #eee; border-radius:4px; max-height:400px; }',
            '#lsc-table { width:100%; border-collapse:collapse; font-size:13px; }',
            '#lsc-table th, #lsc-table td { padding:8px; text-align:left; border-bottom:1px solid #eee; }',
            '#lsc-table th { background:#f8f9fa; position:sticky; top:0; cursor:pointer; }',
            '#lsc-table th:hover { background:#e9ecef; }',
            '.status-in { color:#00b388; font-weight:bold; }',
            '.status-out { color:#dc3545; }',
            '.status-err { color:#fd7e14; }',
            '.lsc-hidden { display:none !important; }'
        ].join('\n');
        document.head.appendChild(style);
    }

    function showPanel() {
        let panel = document.getElementById('lotus-stock-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'lotus-stock-panel';
            panel.innerHTML = '<div id="lsc-header"><span>Lotus Stock Checker</span><button id="lsc-close">&times;</button></div>'
                + '<div id="lsc-body">'
                + '<div id="lsc-product-name" style="font-size:14px;font-weight:bold;margin-bottom:5px;"></div>'
                + '<div id="lsc-controls"><span id="lsc-status">Initializing...</span><label><input type="checkbox" id="lsc-filter"> In Stock Only</label></div>'
                + '<div id="lsc-progress-container"><div id="lsc-progress-bar"></div></div>'
                + '<div id="lsc-table-container"><table id="lsc-table"><thead><tr>'
                + '<th data-sort="name">Branch &#8597;</th>'
                + '<th data-sort="stock">Stock &#8597;</th>'
                + '<th data-sort="pickup">Pickup Available &#8597;</th>'
                + '</tr></thead><tbody id="lsc-tbody"></tbody></table></div>'
                + '</div>';
            document.body.appendChild(panel);

            uiElements = {
                panel: panel,
                productName: document.getElementById('lsc-product-name'),
                status: document.getElementById('lsc-status'),
                progressBar: document.getElementById('lsc-progress-bar'),
                tbody: document.getElementById('lsc-tbody'),
                filter: document.getElementById('lsc-filter'),
                close: document.getElementById('lsc-close'),
                headers: document.querySelectorAll('#lsc-table th')
            };

            uiElements.close.onclick = function () {
                if (state.abortController) state.abortController.abort();
                panel.remove();
                uiElements = {};
            };

            uiElements.filter.onchange = function (e) {
                const checked = e.target.checked;
                uiElements.tbody.querySelectorAll('tr').forEach(function (row) {
                    if (checked && row.dataset.status !== 'IN_STOCK') {
                        row.classList.add('lsc-hidden');
                    } else {
                        row.classList.remove('lsc-hidden');
                    }
                });
            };

            let sortAsc = true;
            uiElements.headers.forEach(function (th) {
                th.onclick = function () {
                    sortAsc = !sortAsc;
                    renderTable(th.dataset.sort, sortAsc);
                };
            });

            const header = document.getElementById('lsc-header');
            let isDown = false, startX, startY, startLeft, startTop;
            header.onmousedown = function (e) {
                isDown = true;
                startX = e.clientX; startY = e.clientY;
                startLeft = panel.offsetLeft; startTop = panel.offsetTop;
            };
            document.onmousemove = function (e) {
                if (!isDown) return;
                panel.style.left = (startLeft + e.clientX - startX) + 'px';
                panel.style.top = (startTop + e.clientY - startY) + 'px';
                panel.style.right = 'auto';
            };
            document.onmouseup = function () { isDown = false; };
        }

        uiElements.productName.textContent = state.productName;
        uiElements.tbody.innerHTML = '';
        uiElements.status.textContent = 'Loading stores...';
        uiElements.progressBar.style.width = '0%';
    }

    function appendRow(store, stockInfo) {
        if (!uiElements.tbody) return;
        const tr = document.createElement('tr');
        tr.dataset.status = stockInfo.status;

        let pickupHtml;
        if (stockInfo.status === 'IN_STOCK') {
            pickupHtml = '<span class="status-in">Yes</span>';
        } else if (stockInfo.status === 'OUT_OF_STOCK') {
            pickupHtml = '<span class="status-out">No</span>';
        } else {
            pickupHtml = '<span class="status-err">-</span>';
        }

        let stockHtml;
        if (stockInfo.status === 'IN_STOCK') {
            stockHtml = '<span class="status-in">&#10003; IN STOCK</span>';
        } else if (stockInfo.status === 'OUT_OF_STOCK') {
            stockHtml = '<span class="status-out">&#10007; OUT</span>';
        } else {
            stockHtml = '<span class="status-err">&#9888; ERROR</span>';
        }

        const qtyText = stockInfo.qty >= 0 ? stockInfo.qty : (stockInfo.status === 'ERROR' ? 'Error' : '-');

        tr.innerHTML = '<td>' + store.name + ' <small style="color:#888">(' + (store.type || '') + ')</small></td>'
            + '<td>' + qtyText + ' ' + stockHtml + '</td>'
            + '<td>' + pickupHtml + '</td>';

        if (uiElements.filter && uiElements.filter.checked && stockInfo.status !== 'IN_STOCK') {
            tr.classList.add('lsc-hidden');
        }
        uiElements.tbody.appendChild(tr);
    }

    function renderTable(sortKey, sortAsc) {
        if (!uiElements.tbody) return;
        let displayData = state.results.map(function (r) {
            const store = state.stores.find(function (s) { return s.id === r.storeId; }) || { name: 'Unknown', type: '' };
            return Object.assign({}, r, { storeName: store.name, storeType: store.type });
        });

        if (sortKey === 'name') {
            displayData.sort(function (a, b) { return a.storeName.localeCompare(b.storeName) * (sortAsc ? 1 : -1); });
        } else if (sortKey === 'stock') {
            displayData.sort(function (a, b) { return (a.qty - b.qty) * (sortAsc ? 1 : -1); });
        } else if (sortKey === 'pickup') {
            displayData.sort(function (a, b) { return a.status.localeCompare(b.status) * (sortAsc ? 1 : -1); });
        }

        uiElements.tbody.innerHTML = '';
        displayData.forEach(function (item) {
            appendRow({ name: item.storeName, type: item.storeType }, item);
        });
    }

    async function startProcess() {
        if (state.isChecking) return;

        const slug = getProductSlug();
        if (!slug || slug.length < 5) {
            alert('Could not detect product slug from URL.');
            return;
        }

        state.productName = getProductName();
        state.isChecking = true;
        state.results = [];
        state.abortController = new AbortController();
        const signal = state.abortController.signal;

        showPanel();

        try {
            state.stores = await getAllStores();
            if (state.stores.length === 0) {
                uiElements.status.textContent = 'Error: No stores found.';
                state.isChecking = false;
                return;
            }

            uiElements.status.textContent = 'Checking 0 / ' + state.stores.length + ' branches...';
            let completed = 0;

            const checkTask = async function (store) {
                const res = await checkStock(slug, store.id, signal);
                state.results.push(res);
                appendRow(store, res);
                completed++;
                if (uiElements.status && uiElements.progressBar) {
                    uiElements.status.textContent = 'Checked ' + completed + ' / ' + state.stores.length;
                    uiElements.progressBar.style.width = ((completed / state.stores.length) * 100) + '%';
                }
                return res;
            };

            await asyncPool(CONFIG.batchSize, state.stores, checkTask);

            if (uiElements.status) {
                const inStock = state.results.filter(function (r) { return r.status === 'IN_STOCK'; }).length;
                uiElements.status.innerHTML = '<strong>Done!</strong> ' + inStock + ' branches have stock.';
            }

        } catch (e) {
            if (e.name === 'AbortError') {
                if (uiElements.status) uiElements.status.textContent = 'Aborted.';
            } else {
                console.error(e);
                if (uiElements.status) uiElements.status.textContent = 'An error occurred.';
            }
        } finally {
            state.isChecking = false;
            state.abortController = null;
        }
    }

    // --- Initialization ---
    setTimeout(function () {
        try {
            injectStyles();
            if (!document.getElementById('lotus-stock-btn')) {
                const btn = document.createElement('button');
                btn.id = 'lotus-stock-btn';
                btn.textContent = '\uD83D\uDED2 Check All Branches';
                btn.onclick = startProcess;
                document.body.appendChild(btn);
                console.log('[LotusChecker] Button injected successfully');
            }
        } catch (e) {
            console.error('[LotusChecker] Init error:', e);
        }
    }, 2000);

})();
