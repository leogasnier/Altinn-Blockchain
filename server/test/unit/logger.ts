import * as chai from 'chai';
import {LoggerFactory} from '../../domain/utils/logger';

chai.should();

describe('The Logger factory', () => {
  before((done) => {
    const factory = new LoggerFactory();
    const logger  = factory.get('test');
    logger.info.should.be.a('function');
    logger.toString = () => 'hi from test';
    done();
  });

  it('reuses an existing logger', (done) => {
    const factory = new LoggerFactory();
    const logger  = factory.get('test');
    logger.info.should.be.a('function');
    logger.toString().should.equal('hi from test');
    done();
  });
});