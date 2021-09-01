let tilData = [
    {
        "date": "2021-08-31",
        "title": "My Title",
        "info": "My Info"
    }
];

let app;

window.onload = function() {
    app = new Vue({ el: '#newsletter-container', data: { companyName: 'Patrick Web Design Inc.' } });

    console.log(TIL_DATA);
};

Vue.component('til-item', {
    template: '<p>Today I learned:</p>'
});