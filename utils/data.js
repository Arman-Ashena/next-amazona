import bcrypt from 'bcryptjs';
const data = {
  users: [
    {
      name: 'arman',
      email: 'armanashena96@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
    {
      name: 'akbar',
      email: 'akbar@gmail.com',
      password: bcrypt.hashSync('123'),
      isAdmin: true,
    },
  ],
  products: [
    {
      name: 'Free shirt',
      category: 'Shirts',
      image: '/images/shirt1.jpg',
      price: '70',
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      count: 20,
      slug: 'free-shirt',
      description: 'lets make a pupular shirt',
    },
    {
      name: 'Free shirt',
      category: 'Shirts',
      image: '/images/shirt2.jpg',
      price: '70',
      brand: 'Guchi',
      rating: 4.5,
      numReviews: 10,
      count: 30,
      slug: 'free-shirt2',
      description: 'dhjn ld;sld iink dskdl n sdfkn kfslfnskf',
    },
    {
      name: 'Feet shirt',
      category: 'Shirts',
      image: '/images/shirt3.jpg',
      price: '90',
      brand: 'Adidas',
      rating: 3.5,
      numReviews: 10,
      count: 40,
      slug: 'feet-shirt3',
      description: 'lets dsfsf sff make adfsf fsdfs fsf ',
    },
    {
      name: 'Slime Pants',
      category: 'Pants',
      image: '/images/pants1.jpg',
      price: '150',
      brand: 'Raymond',
      rating: 4.5,
      numReviews: 10,
      count: 26,
      slug: 'slime-pants',
      description: 'lets sdfs sdlfj jksjfsoir kjfkllsdhj olksff',
    },
    {
      name: 'Golf Pants',
      category: 'Pants',
      image: '/images/pants2.jpg',
      price: '150',
      brand: 'Nike',
      rating: 3.5,
      numReviews: 16,
      count: 120,
      slug: 'golf-pants',
      description: 'lets make a pupular shirt',
    },
  ],
};

export default data;
