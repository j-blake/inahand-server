import mongoose from 'mongoose';

export const mochaHooks = {
  beforeEach(): void {
    Object.keys(mongoose.models).forEach(
      (model) => delete mongoose.models[model]
    );
  },
  afterAll(): void {
    Object.keys(mongoose.models).forEach(
      (model) => delete mongoose.models[model]
    );
  },
};
