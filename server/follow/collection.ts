import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore Follows
 * stored in MongoDB, including adding, finding, and deleting Follows.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {
  /**
   * Add a Follow to the collection
   *
   * @param {string} followerId - The id of the follower
   * @param {string} followingUsername - The username of the user they are following
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(followerId: Types.ObjectId | string, followingUsername: string): Promise<HydratedDocument<Follow>> {
    const dateCreated = new Date();
    const followingId = await UserCollection.findOneByUsername(followingUsername);
    const follow = new FollowModel({
        followerId,
        followingId,
        dateCreated
    });
    await follow.save(); // Saves freet to MongoDB
    return (await follow.populate('followerId')).populate('followingId');
  }

  /**
   * Find a Follow by followId
   *
   * @param {string} followId - The id of the Follow to find
   * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The Follow with the given followId, if any
   */
  static async findOne(followId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({_id: followId}).populate('followerId').populate('followingId');
  }

  /**
   * Find a Follow object by follower and following Ids
   * 
   * @param followerId 
   * @param followingId 
   * @returns 
   */
   static async findOneByIds(followerId: Types.ObjectId | string, followingId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({followerId: followerId, followingId: followingId}).populate('followerId').populate('followingId');
  }

  /**
   * Get all the Follows in the database
   *
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the Follows
   */
  static async findAll(): Promise<Array<HydratedDocument<Follow>>> {
    // Retrieves Follows and sorts them from most to least recent
    return FollowModel.find({}).sort({dateModified: -1}).populate('followerId').populate('followingId');
  }

  /**
   * Get all the Follows by given user
   *
   * @param {string} username - The username of follower
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the Follows
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Follow>>> {
    const follower = await UserCollection.findOneByUsername(username);
    return FollowModel.find({followerId: follower._id}).populate('followerId');
  }

  /**
   * Delete a Follow with given FollowId
   *
   * @param {string} followId - The followId of Follow to delete
   * @return {Promise<Boolean>} - true if the Follow has been deleted, false otherwise
   */
  static async deleteOne(followId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FollowModel.deleteOne({_id: followId});
    return freet !== null;
  }

  /**
   * Delete a Follow with given follower Id and following username
   *
   * @param {string} followerId - The Id of the follower
   * @param {string} followingUsername - The username of user they are following
   * @return {Promise<Boolean>} - true if the Follow has been deleted, false otherwise
   */
   static async deleteByUsernames(followerId: Types.ObjectId | string, followingUsername: string): Promise<boolean> {
    const followingId = (await UserCollection.findOneByUsername(followingUsername))._id;
    const follow = await this.findOneByIds(followerId, followingId);
    const deletion = await FollowModel.deleteOne({_id: follow._id});
    return deletion !== null;
  }

  /**
   * Delete all the Follows by given user
   *
   * @param {string} followerId - The id of author of freets
   */
  static async deleteMany(followerId: Types.ObjectId | string): Promise<void> {
    await FollowModel.deleteMany({followerId});
  }
}

export default FollowCollection;