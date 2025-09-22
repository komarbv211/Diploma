using AutoMapper;
using Core.DTOs.BrandsDTOs;
using Core.DTOs.CategoryDTOs;
using Core.DTOs.ProductsDTO;
using Core.Exceptions;
using Core.Interfaces;
using Core.Repositories;
using Core.Specifications;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Core.Services
{
    public class BrandService : IBrandService
    {
        private readonly IRepository<BrandEntity> _brandRepository;
        private readonly IMapper _mapper;
        public BrandService(IRepository<BrandEntity> brandRepository, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
        }



        public async Task<BrandItemDto> CreateBrandAsync(BrandCreateDto dto)
        {

            var brandExists = _brandRepository
        .GetAllQueryable()
        .Any(b => b.Name.ToLower() == dto.Name.ToLower());

            if (brandExists)
            {
                throw new HttpException($"Бренд з назвою '{dto.Name}' вже існує.", HttpStatusCode.Conflict);
            }

            try
            {
                var brand = _mapper.Map<BrandEntity>(dto);
                await _brandRepository.Insert(brand);
                await _brandRepository.SaveAsync();

                return _mapper.Map<BrandItemDto>(brand);
            }
            catch (DbUpdateException dbEx)
            {
                throw new HttpException("Помилка при збереженні бренду в базі даних", HttpStatusCode.InternalServerError, dbEx);
            }
            catch (Exception ex)
            {
                throw new HttpException("Невідома помилка при створенні бренду", HttpStatusCode.InternalServerError, ex);
            }

            //try
            //{
            //    // Перевірка на існування бренду з такою ж назвою (чутлива до регістру або ні — залежно від потреб)
            //     var existingBrand = await _brandRepository.FirstOrDefaultAsync(
            //     b => b.Name.ToLower() == dto.Name.ToLower()
            //     );

            //    if (existingBrand != null)
            //    {
            //        throw new HttpException(
            //            $"Бренд з назвою '{dto.Name}' вже існує.",
            //            HttpStatusCode.Conflict
            //        );
            //    }

            //    var brand = _mapper.Map<BrandEntity>(dto);
            //    await _brandRepository.Insert(brand);
            //    await _brandRepository.SaveAsync();

            //    return _mapper.Map<BrandItemDto>(brand);
            //}
            //catch (DbUpdateException dbEx)
            //{
            //    throw new HttpException("Помилка при збереженні бренду в базі даних", HttpStatusCode.InternalServerError, dbEx);
            //}
            //catch (Exception ex)
            //{
            //    throw new HttpException("Невідома помилка при створенні бренду", HttpStatusCode.InternalServerError, ex);
            //}

            //try
            //{
            //    var brand = _mapper.Map<BrandEntity>(dto);
            //    await _brandRepository.Insert(brand);
            //    await _brandRepository.SaveAsync();

            //    return _mapper.Map<BrandItemDto>(brand);
            //}
            //catch (DbUpdateException dbEx)
            //{
            //    throw new HttpException("Помилка при збереженні бренду в базі даних", HttpStatusCode.InternalServerError, dbEx);
            //}
            //catch (Exception ex)
            //{
            //    throw new HttpException("Невідома помилка при створенні бренду", HttpStatusCode.InternalServerError, ex);
            //}
        }

        public async Task DeleteBrandAsync(long id)
        {
            var brand = await _brandRepository.GetByID(id);
            if (brand != null)
            {
                await _brandRepository.DeleteAsync(id);
                await _brandRepository.SaveAsync();
            }
        }



        public async Task<List<BrandItemDto>> GetBrandsAsync()
        {
            try
            {
                var brands = await _brandRepository.GetAllAsync();
                return _mapper.Map<List<BrandItemDto>>(brands);
            }
            catch (Exception ex)
            {
                throw new HttpException("Помилка при отриманні списку брендів", HttpStatusCode.InternalServerError, ex);
            }
        }

        public async Task<BrandItemDto?> GetByIdAsync(long id)
        {
            var brand = await _brandRepository.GetByID(id);
            return brand == null ? null : _mapper.Map<BrandItemDto>(brand);
        }

        public async Task UpdateBrandAsync(BrandUpdateDto dto)
        {
            var brand = await _brandRepository.GetByID(dto.Id);
            if (brand == null) return;

            _mapper.Map(dto, brand);

            await _brandRepository.Update(brand);
            await _brandRepository.SaveAsync();
        }
    }
}
