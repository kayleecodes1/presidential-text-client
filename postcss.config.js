module.exports = {
    plugins: [
        require('postcss-url')({
            url: 'rebase',
            basePath: 'src/assets'
        }),
        require('autoprefixer')({
            browsers: ['last 2 versions']
        })
    ]
};
