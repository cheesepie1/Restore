using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    // It handles CRUD operations for the Product entity
    public class ProductsController(StoreContext context, IMapper mapper,
     ImageService imageService) : BaseApiController
    {
        private readonly StoreContext context = context;

        // Returns a paginated list of products with filtering, searching, and sorting
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts(
            [FromQuery] ProductParams productParams)
        {
            var query = context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable();
            // Paginate the result
            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);
             // Add pagination metadata to response headers
            Response.AddPaginationHeader(products.Metadata);

            return products;
        }

         // Returns a single product by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return product;
        }

        // Returns unique brands and types from all products (used for filter UI)
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await context.Products.Select(x => x.Brand).Distinct().ToListAsync();
            var types = await context.Products.Select(x => x.Type).Distinct().ToListAsync();
            return Ok(new { brands, types });
        }

        // Creates a new product (admin only)
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
        {
            // Map DTO to entity
            var product = mapper.Map<Product>(productDto);
            // Handle image upload if a file was included
            if (productDto.File != null)
            {
                var imageResult = await imageService.AddImageAsync(productDto.File);

                if (imageResult.Error != null)
                {
                    return BadRequest(imageResult.Error.Message);
                }

                product.PictureUrl = imageResult.SecureUrl.AbsoluteUri;
                product.PublicId = imageResult.PublicId;

            }

            // Save to database
            context.Products.Add(product);
            var result = await context.SaveChangesAsync() > 0;
            if (result) return CreatedAtAction(nameof(GetProduct), new { Id = product.Id }, product);
            return BadRequest("Problem creating new product");
        }

         // Updates an existing product (admin only)
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdateProduct(UpdateProductDto updateProductDto)
        {
            var product = await context.Products.FindAsync(updateProductDto.Id);
            if (product == null) return NotFound();

            mapper.Map(updateProductDto, product);
            // If new image file is provided, replace the old image
            if (updateProductDto.File != null)
            {
                var imageResult = await imageService.AddImageAsync(updateProductDto.File);
                if (imageResult.Error != null)
                    return BadRequest(imageResult.Error.Message);
                if (!string.IsNullOrEmpty(product.PublicId))
                    await imageService.DeleteImageAsync(product.PublicId);

                product.PictureUrl = imageResult.SecureUrl.AbsoluteUri;
                product.PublicId = imageResult.PublicId;

            }
            var result = await context.SaveChangesAsync() > 0;
            if (result) return NoContent();
            return BadRequest("Problem updating product");
        }

        // Deletes a product by ID (admin only)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await context.Products.FindAsync(id);
            if (product == null) return NotFound();

            if (!string.IsNullOrEmpty(product.PublicId))
                await imageService.DeleteImageAsync(product.PublicId);

            // Remove product from database
            context.Products.Remove(product);
            var result = await context.SaveChangesAsync() > 0;
            if (result) return Ok();
            return BadRequest("Problem deleting the product");

        }


    }
}
