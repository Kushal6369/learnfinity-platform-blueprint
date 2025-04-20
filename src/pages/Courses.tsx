import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import CourseGrid from '@/components/courses/CourseGrid';
import { CourseType } from '@/components/courses/CourseCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getPublishedCourses } from '@/services/courseService';
import { Course } from '@/services/courseService';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allCourses, setAllCourses] = useState<CourseType[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const courses = await getPublishedCourses();
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(courses.map(course => course.category))];
        setCategories(uniqueCategories);
        
        // Transform data to match CourseType
        const transformedCourses: CourseType[] = courses.map(course => ({
          id: course.id,
          title: course.title,
          instructor: 'Instructor Name', // This would normally come from a join with profiles
          instructor_id: course.instructor_id,
          category: course.category,
          thumbnailUrl: course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
          rating: course.rating || 0,
          duration: course.duration,
          studentsCount: 0, // This would normally come from a count of enrollments
          price: course.price,
          level: course.level
        }));
        
        setAllCourses(transformedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  // Filter courses based on search query and filters
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    
    const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
    
    const matchesRating = ratingFilter === 0 || course.rating >= ratingFilter;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });
  
  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.studentsCount - a.studentsCount;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        // In a real app, we'd sort by date
        return 0;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });
  
  const applyFilters = () => {
    const filters: string[] = [];
    
    if (selectedCategory !== 'All') {
      filters.push(`Category: ${selectedCategory}`);
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 100) {
      filters.push(`Price: $${priceRange[0]} - $${priceRange[1]}`);
    }
    
    if (ratingFilter > 0) {
      filters.push(`Rating: ${ratingFilter}+ stars`);
    }
    
    setAppliedFilters(filters);
  };
  
  const resetFilters = () => {
    setSelectedCategory('All');
    setPriceRange([0, 100]);
    setRatingFilter(0);
    setAppliedFilters([]);
  };
  
  const removeFilter = (filter: string) => {
    if (filter.startsWith('Category:')) {
      setSelectedCategory('All');
    } else if (filter.startsWith('Price:')) {
      setPriceRange([0, 100]);
    } else if (filter.startsWith('Rating:')) {
      setRatingFilter(0);
    }
    
    setAppliedFilters(appliedFilters.filter(f => f !== filter));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Explore Courses</h1>
            <p className="text-gray-600 mt-2">Discover courses to enhance your skills</p>
          </div>
          
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Narrow down courses to find exactly what you're looking for.
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6 py-6">
                    {/* Category filter */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Category</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`category-${category}`}
                              checked={selectedCategory === category}
                              onCheckedChange={() => setSelectedCategory(category)}
                            />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price Range */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">Price Range</h4>
                        <span className="text-sm text-gray-500">
                          ${priceRange[0]} - ${priceRange[1]}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[0, 100]}
                        max={100}
                        step={5}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>
                    
                    {/* Rating filter */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Rating</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[0, 3, 3.5, 4, 4.5].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`rating-${rating}`}
                              checked={ratingFilter === rating}
                              onCheckedChange={() => setRatingFilter(rating)}
                            />
                            <Label htmlFor={`rating-${rating}`}>
                              {rating === 0 ? 'Any Rating' : `${rating}+ stars`}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <SheetFooter>
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                    <Button onClick={applyFilters}>
                      Apply Filters
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Desktop filters */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {category}
                </Button>
              ))}
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Narrow down courses to find exactly what you're looking for.
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6 py-6">
                    {/* Price Range */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">Price Range</h4>
                        <span className="text-sm text-gray-500">
                          ${priceRange[0]} - ${priceRange[1]}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[0, 100]}
                        max={100}
                        step={5}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>
                    
                    {/* Rating filter */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Rating</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[0, 3, 3.5, 4, 4.5].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`desktop-rating-${rating}`}
                              checked={ratingFilter === rating}
                              onCheckedChange={() => setRatingFilter(rating)}
                            />
                            <Label htmlFor={`desktop-rating-${rating}`}>
                              {rating === 0 ? 'Any Rating' : `${rating}+ stars`}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <SheetFooter>
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                    <Button onClick={applyFilters}>
                      Apply Filters
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Applied filters */}
          {appliedFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Filters:</span>
              {appliedFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <button 
                    onClick={() => removeFilter(filter)}
                    className="ml-1 hover:text-red-500"
                  >
                    ✕
                  </button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-red-500 hover:text-red-700">
                Clear All
              </Button>
            </div>
          )}
          
          {/* Results count */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Showing {sortedCourses.length} courses</p>
          </div>
          
          {/* Courses grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Loading courses...</p>
            </div>
          ) : sortedCourses.length > 0 ? (
            <CourseGrid courses={sortedCourses} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
              <Button onClick={resetFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses;
