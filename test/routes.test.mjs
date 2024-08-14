import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import CombinedData from '../src/schema.js';
import episodeRouter from '../src/routes.js';

describe('Routes', () => {
  let app;

  before(() => {
    app = express();
    app.use('/episodes', episodeRouter);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should fetch all episodes', async () => {
    const mockData = [{ season: 1, episode: 1, title: 'Episode 1' }];
    sinon.stub(CombinedData, 'find').resolves(mockData);

    const res = await request(app).get('/episodes');

    expect(res.status).to.equal(200);
    expect(res.body.data).to.deep.equal(mockData);
  });

  it('should return episodes by season', async () => {
    const mockData = [{ season: 1, episode: 1, title: 'Episode 1' }];
    sinon.stub(CombinedData, 'find').resolves(mockData);

    const res = await request(app).get('/episodes/season/1');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(mockData);
  });

  it('should return 404 if no episodes found for a season', async () => {
    sinon.stub(CombinedData, 'find').resolves([]);

    const res = await request(app).get('/episodes/season/999');

    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('No episodes found for this season');
  });

  it('should fetch episode by season and episode', async () => {
    const mockEpisode = { season: 1, episode: 1, TITLE: 'Episode 1' };
    sinon.stub(CombinedData, 'findOne').resolves(mockEpisode);

    const res = await request(app).get('/episodes/1/1');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(mockEpisode);
  });

  it('should return 404 if episode not found', async () => {
    sinon.stub(CombinedData, 'findOne').resolves(null);

    const res = await request(app).get('/episodes/1/999');

    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('Episode not found');
  });
});
