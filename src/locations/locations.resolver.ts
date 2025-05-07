import { Resolver, Query, Mutation, Args, Float } from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';
import { CreateLocationInput } from './dto/create-location.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Location)
@UseGuards(JwtAuthGuard)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Query(() => [Location])
  async locations() {
    return this.locationsService.findAll();
  }

  @Query(() => Location)
  async location(@Args('id') id: number) {
    return this.locationsService.findOne(id);
  }

  @Query(() => [Location])
  async locationsByDistrict(@Args('district') district: string) {
    return this.locationsService.findByDistrict(district);
  }

  @Mutation(() => Location)
  async createLocation(
    @Args('createLocationInput') createLocationInput: CreateLocationInput
  ) {
    return this.locationsService.create(createLocationInput);
  }

  @Mutation(() => Location)
  async updateLocation(
    @Args('id') id: number,
    @Args('updateLocationInput') updateLocationInput: CreateLocationInput
  ) {
    return this.locationsService.update(id, updateLocationInput);
  }

  @Mutation(() => Location)
  async removeLocation(@Args('id') id: number) {
    await this.locationsService.remove(id);
    return { id };
  }
}