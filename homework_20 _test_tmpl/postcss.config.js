module.exports = {
  plugins: [
    require('css-mqpacker')({
      sort: true // сортує від малих до великих (можна також false)
    })
  ]
};
