import { Request, Response } from 'express';
import Mart from '../models/martModel';
import Rating from '../models/ratingModel';
import CustomerFavourite from '../models/customerFavouriteModel';
import mongoose from 'mongoose';
import path from 'path';
//addMart
const addMart = async (req: Request, res: Response) => {
	try {
		const { name, address, vendor_id, img } = req.body;

		// Create a new mart object
		const newMart = new Mart({
			name,
			address,
			img: img,
			vendor_id,
		});

		// Save the new mart to the database
		await newMart.save();

		res.status(201).json({ success: true, message: 'Mart added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const uploadPic = async (req: Request, res: Response) => {
	try {
		// Check if a file was uploaded
		if (!req.file) {
			return res
				.status(400)
				.json({ success: false, message: 'No image uploaded' });
		}

		// Get the file name
		const imgName = path.basename(req.file.path);

		res.status(200).json({ success: true, imagePath: imgName });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

// const getAllMart = async (req: Request, res: Response) => {
// 	try {
// 		const customerId = req.params.id; // Get the customer ID from request params

// 		// Aggregate to join Mart with CustomerFavourite and calculate count of ratings for each mart
// 		const allMartWithRatings = await Mart.aggregate([
// 			{
// 				$lookup: {
// 					from: 'ratings', // Collection name for Rating model
// 					localField: '_id', // Field from Mart collection
// 					foreignField: 'mart_id', // Field from Rating collection
// 					as: 'ratings', // Array field in Mart containing ratings
// 				},
// 			},
// 			{
// 				$lookup: {
// 					from: 'customerfavourites', // Collection name for CustomerFavourite model
// 					let: { martId: '$_id' }, // Local field from Mart collection
// 					pipeline: [
// 						{
// 							$match: {
// 								$expr: {
// 									$and: [
// 										{ $eq: ['$mart_id', '$$martId'] }, // Match by mart ID
// 										{
// 											$eq: [
// 												'$customer_id',
// 												new mongoose.Types.ObjectId(customerId),
// 											],
// 										}, // Match by customer ID
// 									],
// 								},
// 							},
// 						},
// 					],
// 					as: 'customer_favourite', // Array field in Mart containing customer favourites
// 				},
// 			},
// 			{
// 				$project: {
// 					name: 1,
// 					address: 1,
// 					img: 1,
// 					isFeatured: 1,
// 					no_of_views: 1,
// 					vendor_id: 1,
// 					ratingCount: { $size: '$ratings' }, // Count of ratings for each mart
// 					isCustomerFavourite: {
// 						$cond: [
// 							{ $gt: [{ $size: '$customer_favourite' }, 0] },
// 							true,
// 							false,
// 						],
// 					},
// 					averageRating: {
// 						$cond: [
// 							{ $gt: [{ $size: '$ratings' }, 0] },
// 							{ $avg: '$ratings.no_of_rating' }, // Calculate average rating if there are ratings
// 							null, // Set to null if there are no ratings
// 						],
// 					},
// 				},
// 			},
// 		]);

// 		res.status(200).json({ success: true, marts: allMartWithRatings });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// };

const getAllMart = async (req: Request, res: Response) => {
	try {
		const customerId = req.query.customerId as string; // Get the customer ID from request query params
		const searchQuery = req.query.searchQuery; // Get the search query from request query params

		// Create a regular expression for case-insensitive search
		const regex = new RegExp(searchQuery as string, 'i');

		// Aggregate to join Mart with CustomerFavourite and calculate count of ratings for each mart
		const allMartWithRatings = await Mart.aggregate([
			{
				$lookup: {
					from: 'ratings', // Collection name for Rating model
					localField: '_id', // Field from Mart collection
					foreignField: 'mart_id', // Field from Rating collection
					as: 'ratings', // Array field in Mart containing ratings
				},
			},
			{
				$lookup: {
					from: 'customerfavourites', // Collection name for CustomerFavourite model
					let: { martId: '$_id' }, // Local field from Mart collection
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ['$mart_id', '$$martId'] }, // Match by mart ID
										{
											$eq: [
												'$customer_id',
												new mongoose.Types.ObjectId(customerId),
											],
										}, // Match by customer ID
									],
								},
							},
						},
					],
					as: 'customer_favourite', // Array field in Mart containing customer favourites
				},
			},
			{
				$match: {
					name: { $regex: regex }, // Match mart names based on search query
				},
			},
			{
				$project: {
					name: 1,
					address: 1,
					img: 1,
					isFeatured: 1,
					no_of_views: 1,
					vendor_id: 1,
					ratingCount: { $size: '$ratings' }, // Count of ratings for each mart
					isCustomerFavourite: { $gt: [{ $size: '$customer_favourite' }, 0] }, // Check if customer has favorited the mart
					averageRating: {
						$cond: [
							{ $gt: [{ $size: '$ratings' }, 0] },
							{ $avg: '$ratings.no_of_rating' }, // Calculate average rating if there are ratings
							null, // Set to null if there are no ratings
						],
					},
				},
			},
		]);

		res.status(200).json({ success: true, marts: allMartWithRatings });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export default getAllMart;

const addMartRating = async (req: Request, res: Response) => {
	try {
		const { customer_id, mart_id, no_of_rating, comment } = req.body;

		// Create a new rating object
		const newRating = new Rating({
			customer_id,
			mart_id,
			no_of_rating,
			comment,
		});

		// Save the new rating to the database
		await newRating.save();

		res
			.status(201)
			.json({ success: true, message: 'Rating added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const addMartCustomerFavourite = async (req: Request, res: Response) => {
	try {
		const { customer_id, mart_id, isFavourite } = req.body;

		// Check if the customer has already marked the mart as favorite
		const existingFavorite = await CustomerFavourite.findOne({
			customer_id,
			mart_id,
		});

		if (existingFavorite) {
			// Update the existing favorite with the new isFavourite status
			existingFavorite.isFavourite = isFavourite;
			await existingFavorite.save();
		} else {
			// Create a new favorite object
			const newFavorite = new CustomerFavourite({
				customer_id,
				mart_id,
				isFavourite,
			});
			// Save the new favorite to the database
			await newFavorite.save();
		}

		res
			.status(201)
			.json({ success: true, message: 'Favorite mart updated successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export {
	addMart,
	uploadPic,
	getAllMart,
	addMartRating,
	addMartCustomerFavourite,
};
