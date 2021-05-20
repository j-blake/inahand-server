import mongoose from 'mongoose';

export const mochaHooks = {
  afterEach(): void {
    Object.keys(mongoose.models).forEach(
      (model) => delete mongoose.models[model]
    );
  },
};
