import mongoose from 'mongoose';

    async function main(): Promise<void> {
      try {
        await mongoose.connect('mongodb://localhost27017/otimizacaoDeRotas');
        console.log('Successfully connected to MongoDB!');
      } catch (error) {
        console.error('MongoDB connection error:', error);
      }
    }

    main().catch((err) => console.log(err));

    module.exports = mongoose