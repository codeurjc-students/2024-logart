const mongoose = require('mongoose');
const Comment = require('../models/comment.model');
const ObjectModel = require('../models/object.model');
const User = require('../models/user.model');

const seedComments = async () => {
  try {
    const objects = await ObjectModel.find({});
    const users = await User.find({ role: 'user' });
    const admins = await User.find({ role: 'admin' });

    if (objects.length === 0 || users.length === 0 || admins.length === 0) {
      console.log('Ensure that objects and users are seeded before seeding comments.');
      return;
    }

    const comments = [
      {
        content: '¡Me encantó este libro!',
        object: objects.find(o => o.name === 'Cien Años de Soledad')._id,
        user: users[0]._id,
      },
      {
        content: 'Bohemian Rhapsody es una obra maestra.',
        object: objects.find(o => o.name === 'Bohemian Rhapsody')._id,
        user: users[1]._id,
      },
      {
        content: 'The Legend of Zelda siempre me ha fascinado.',
        object: objects.find(o => o.name === 'The Legend of Zelda')._id,
        user: users[0]._id,
      },
      {
        content: '¡Controla tu lenguage!',
        object: objects.find(o => o.name === 'The Legend of Zelda')._id,
        user: admins[0]._id,
      },
      {
        content: 'Intenta respetar las normas de la comunidad.',
        object: objects.find(o => o.name === 'Bohemian Rhapsody')._id,
        user: admins[1]._id,
      },
      {
        content: '¡Perdón!',
        object: objects.find(o => o.name === 'The Legend of Zelda')._id,
        user: users[0]._id,
      },
      {
        content: 'Este es un aviso para que no lo olvides.',
        object: objects.find(o => o.name === 'Cien Años de Soledad')._id,
        user: admins[0]._id,
      },
      {
        content: '¡Soy admin, y me encanta este juego!',
        object: objects.find(o => o.name === 'The Legend of Zelda 2')._id,
        user: admins[0]._id,
      },
      {
        content: '¡Me encantó este juego!',
        object: objects.find(o => o.name === 'The Legend of Zelda 3')._id,
        user: admins[1]._id,
      },
    ];

    for (const commentData of comments) {
      const exist = await Comment.findOne({ content: commentData.content, object: commentData.object, user: commentData.user });
      if (!exist) {
        await Comment.create(commentData);
        console.log(`Comment created for object ID: ${commentData.object}`);
      } else {
        console.log(`Comment for object ID: ${commentData.object} already exists`);
      }
    }
    console.log('Comments seeded successfully');
  } catch (error) {
    console.error('Error seeding comments:', error);
    process.exit(1);
  }
};

module.exports = seedComments;
