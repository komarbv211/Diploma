using AutoMapper;
using Core.DTOs.CommentDTOs;
using Core.Exceptions;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Core.Services
{
    public class CommentService : ICommentService
    {
        private readonly IRepository<CommentEntity> _commentRepository;
        private readonly IMapper _mapper;
        private readonly DbMakeUpContext _context;

        public CommentService(IRepository<CommentEntity> commentRepository, IMapper mapper, DbMakeUpContext context)
        {
            _commentRepository = commentRepository;
            _mapper = mapper;
            _context = context;
        }

        public async Task<List<CommentItemDto>> GetCommentsByProductIdAsync(long productId)
        {
            try
            {
                var comments = await _commentRepository.GetAllQueryable()
                    .Include(c => c.User)
                    .Where(c => c.ProductId == productId)
                    .OrderByDescending(c => c.DateCreated)
                    .ToListAsync();

                return _mapper.Map<List<CommentItemDto>>(comments);
            }
            catch (Exception ex)
            {
                throw new HttpException("Помилка при отриманні коментарів продукту", HttpStatusCode.InternalServerError, ex);
            }
        }

        public async Task<CommentItemDto> AddCommentAsync(CommentCreateDto dto)
        {
            try
            {
                var comment = new CommentEntity
                {
                    ProductId = dto.ProductId,
                    UserId = dto.UserId,
                    Text = dto.Text,
                    DateCreated = DateTime.UtcNow
                };

                await _commentRepository.AddAsync(comment);
                await _commentRepository.SaveAsync();

                return _mapper.Map<CommentItemDto>(comment);
            }
            catch (Exception ex)
            {
                throw new HttpException("Помилка при додаванні коментаря", HttpStatusCode.InternalServerError, ex);
            }
        }

        public async Task DeleteCommentAsync(long id)
        {
            try
            {
                await _commentRepository.DeleteAsync(id);
                await _commentRepository.SaveAsync();
            }
            catch (Exception ex)
            {
                throw new HttpException("Помилка при видаленні коментаря", HttpStatusCode.InternalServerError, ex);
            }
        }
        public async Task<List<CommentItemDto>> GetRandomCommentsAsync(int count = 5)
        {
            try
            {
                var comments = await _commentRepository.GetAllQueryable()
                    .Include(c => c.User)
                    .Include(c => c.Product)
                        .ThenInclude(p => p.Images)
                    .OrderBy(c => Guid.NewGuid()) 
                    .Take(count)
                    .ToListAsync();

                return _mapper.Map<List<CommentItemDto>>(comments);
            }
            catch (Exception ex)
            {
                throw new HttpException("Помилка при отриманні випадкових коментарів", HttpStatusCode.InternalServerError, ex);
            }
        }

    }
}
