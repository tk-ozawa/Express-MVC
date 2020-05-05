const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')

const Movie = require('./models/movie')
const MovieType = require('./types/movie')

const Director = require('./models/director')
const DirectorType = require('./types/director')

// データ抽出方法
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    movie: {
      type: MovieType,
      args: ({
        id: {
          type: GraphQLString
        }
      }),
      resolve(parents, args) {
        return Movie.findById(args.id)
      },
    },
    director: {
      type: DirectorType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parents, args) {
        return Director.findById(args.id)
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movie.find({})
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        return Director.find({})
      }
    }
  }
})

// データ変更方法
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMovie: {
      type: MovieType,
      args: {
        name: {
          type: GraphQLString
        },
        genre: {
          type: GraphQLString
        },
        directorId: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        let movie = new Movie({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId
        })

        return movie.save()
      }
    },
    addDirector: {
      type: DirectorType,
      args: {
        name: {
          type: GraphQLString
        },
        age: {
          type: GraphQLInt
        }
      },
      resolve(parent, args) {
        let director = new Director({
          name: args.name,
          age: args.age
        })

        return director.save()
      }
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID)
        },
        name: {
          type: GraphQLString
        },
        age: {
          type: GraphQLInt
        }
      },
      resolve(parent, args) {
        let updateDirector = {}
        args.name && (updateDirector.name = args.name)
        args.age && (updateDirector.age = args.age)
        return Director.findByIdAndUpdate(args.id, updateDirector, {
          new: true // 変更後の値をキャッチ
        })
      }
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID)
        },
        name: {
          type: GraphQLString
        },
        genre: {
          type: GraphQLString
        },
        directorId: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        let updateMovie = {}
        args.name && (updateMovie.name = args.name)
        args.genre && (updateMovie.genre = args.genre)
        args.directorId && (updateMovie.directorId = args.directorId)
        return Movie.findByIdAndUpdate(args.id, updateMovie, {
          new: true // 変更後の値をキャッチ
        })
      }
    },
    deleteMovie: {
      type: MovieType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID)
        },
      },
      resolve(parent, args) {
        return Movie.findByIdAndRemove(args.id)
      }
    },
    deleteDirector: {
      type: DirectorType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID)
        },
      },
      resolve(parent, args) {
        return Director.findByIdAndRemove(args.id)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
