module.exports = (date) => {
    let stamp = Math.floor((date - Date.now()) / 1000);

    let s = Math.floor(stamp % 60);
    stamp = ( stamp - s ) / 60;

    let m = Math.floor(stamp % 60);
    stamp = ( stamp - m ) / 60;

    let	h = Math.floor(( stamp ) % 24);
    let	d = Math.floor(( stamp - h ) / 24);

    return {
        arr: [ d, h, m, s ],

        text: `${d > 0 ? `${d} д.` : ``}${h > 0 ? ` ${h} ч.` : ``}${m > 0 ? ` ${m} м.` : ``}${s > 0 ? ` ${s} с.` : ``}`
    }

    // return [(d > 0 ? Math.floor(d):0), (h > 0 ? Math.floor(h):0), (m > 0 ? Math.floor(m):0), (s > 0 ? Math.floor(s):0)];
}