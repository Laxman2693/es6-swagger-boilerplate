import { Content } from '../models';

/**
 * @route GET /content/all
 * @group Content
 * @produces application/json
 * @consumes application/json
 */
const getAllContent = async (req, res) => {
  try {
    const response = await Content.find({});

    if (response.length) {
      res.status(200).jsonp({ msg: 'Content found', data: response });
    } else {
		throw ({ msg: 'Content not found', data: null });
			}
	} catch (err) {
    res.status(400).jsonp({ msg: err });
  }
}

/**
 * @route GET /content/{id}
 * @group Content
 * @param { string } id.path.required
 * @produces application/json
 * @consumes application/json
 */
const getContent = async (req, res) => {
  try {
    const response = await Content.findOne({ _id: req.params.id });

    if (response) {
      res.status(200).jsonp({ msg: 'content found', data: response });
    } else {
      throw ({
        msg: "Content not found",
        data: null
      });
    }
  } catch (err) {
    res.status(400).jsonp({ msg: err });
  }
}

/**
 * @typedef addContent
 * @property {string} title.required - title - eg: FAQ
 * @property {string} sub_title.required - sub_title - eg: sub part of FAQ
 * @property {string} image.required - image - eg: https://images-na.ssl-images-amazon.com/images/I/51N0Y6osPIL._SY450_.jpg
 * @property {string} image_description.required - image_description - eg: short description about image
 * @property {string} description.required - description - Some information about content
 */
/**
 * @route POST /content/add
 * @group Content
 * @param {addContent.model} addContent.body.required
 * @produces application/json
 * @consumes application/json
 */
const addContent = async (req, res) => {
  try {
    const response = await Content.create({
			title: req.body.title,
			sub_title: req.body.sub_title,
			image: req.body.image,
			image_description: req.body.image_description,
			description: req.body.description
    });

    if (response) {
      res.status(200).jsonp({ msg: '', data: response });
    } else {
      throw ({
        msg: 'Not added',
        data: null
      });
    }
  } catch (err) {
    res.status(400).jsonp({ msg: err, data: null });
  }
};

/**
 * @typedef updateContent
 * @property {string} title.required - title - eg: FAQ
 * @property {string} sub_title.required - sub_title - eg: sub part of FAQ
 * @property {string} image.required - image - eg: https://images-na.ssl-images-amazon.com/images/I/51N0Y6osPIL._SY450_.jpg
 * @property {string} image_description.required - image_description - eg: short description about image
 * @property {string} description.required - description - Some information about content
 */
/**
 * @route POST /content/{id}
 * @group Content
 * @param {string} id.path.required
 * @param {updateContent.model} updateContent.body.required
 * @produces application/json
 * @consumes application/json
 */
const updateContent = async (req, res) => {
  try {
    const response = await Content.updateOne({ _id: req.params.id }, {
			title: req.body.title,
			sub_title: req.body.sub_title,
			image: req.body.image,
			image_description: req.body.image_description,
			description: req.body.description
    });

    if (response) {
      res.status(200).jsonp({ msg: 'Updated', data: response });
    } else {
      throw ({
        msg: "Not updated",
        data: null
      });
    }
  } catch (err) {
    res.status(400).jsonp({ msg: err, data: null });
  }
};


/**
 * @route DELETE /content/{id}
 * @group Content
 * @param {string} id.path.required
 * @produces application/json
 * @consumes application/json
 */
const removeContent = async (req, res) => {
  try {
    const response = await Content.deleteOne({ _id: req.params.id });

    if (response) {
      res.status(200).jsonp({ msg: 'Removed', data: response });
    }
  } catch (err) {
    res.status(400).jsonp({ msg: err, data: null });
  }
};

const content = {
  getAllContent,
  getContent,
  addContent,
  updateContent,
  removeContent
};

export default content;
