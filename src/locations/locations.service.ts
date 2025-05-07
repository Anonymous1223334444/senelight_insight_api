import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationInput } from './dto/create-location.input';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async findByDistrict(district: string): Promise<Location[]> {
    return this.locationRepository.find({ where: { district } });
  }

  async create(createLocationInput: CreateLocationInput): Promise<Location> {
    const { name, district, latitude, longitude } = createLocationInput;
    
    const location = this.locationRepository.create({
      name,
      district
    });
    
    if (latitude && longitude) {
      location.point = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };
    }
    
    return this.locationRepository.save(location);
  }

  async update(id: number, updateLocationInput: CreateLocationInput): Promise<Location> {
    const location = await this.findOne(id);
    const { name, district, latitude, longitude } = updateLocationInput;
    
    if (name) location.name = name;
    if (district) location.district = district;
    
    if (latitude && longitude) {
      location.point = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };
    }
    
    return this.locationRepository.save(location);
  }

  async remove(id: number): Promise<void> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
  }
}