const mongoose = require('mongoose')
const Schcema  = mongoose.Schema



const BlogSchema = new Schcema({
  title:{
     type: String,
     required: false,
  }
}, {timestamps:true})



const Blog = mongoose.model('Blog', BlogSchema)


module.exports = Blog