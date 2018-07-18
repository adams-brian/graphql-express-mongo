import { GraphQLList, GraphQLInt, GraphQLID, 
  GraphQLObjectType, GraphQLString, GraphQLSchema, 
  GraphQLNonNull } from 'graphql';
import User from '../mongoose/user';
import Counters from '../mongoose/counters';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    counters: {
      type: new GraphQLList(GraphQLInt),
      resolve: () =>
        Counters.findOne({}).then((doc: any) =>
          doc === null ? [] : doc.counters
        )
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: () =>
        User.find({})
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (parent, { id }) =>
        User.findById(id)
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        firstname: { type: new GraphQLNonNull(GraphQLString) },
        lastname: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, { firstname, lastname }) => {
        const user = new User({
          firstname,
          lastname
        });
        return user.save();
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        firstname: { type: new GraphQLNonNull(GraphQLString) },
        lastname: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, { id, firstname, lastname }) => {
        return User.findByIdAndUpdate(id, 
          { firstname, lastname },
          { new: true }
        );
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: (parent, { id }) => {
        return User.findByIdAndRemove(id);
      }
    },
    saveCounters: {
      type: new GraphQLList(GraphQLInt),
      args: {
        counters: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)) }
      },
      resolve: (parent, { counters }) =>
        Counters.findOneAndUpdate(
          {}, 
          { counters }, 
          { upsert: true, new: true } 
        ).then((doc: any) =>
          doc.counters
        )
    }
  }
})

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
