using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<List<Profiles.Profile>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Profiles.Profile>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<List<Profiles.Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await _context.UserFollowings
                                    .Where(uf => uf.Target.UserName == request.Username)
                                    .Select(uf => uf.Observer)
                                    .ProjectTo<Profiles.Profile>(
                                        _mapper.ConfigurationProvider,
                                        new { currentUsername = _userAccessor.GetUsername() }
                                    )
                                    .ToListAsync();
                        break;
                    case "following":
                        profiles = await _context.UserFollowings
                                    .Where(uf => uf.Observer.UserName == request.Username)
                                    .Select(uf => uf.Target)
                                    .ProjectTo<Profiles.Profile>(
                                        _mapper.ConfigurationProvider,
                                        new { currentUsername = _userAccessor.GetUsername() }
                                    )
                                    .ToListAsync();
                        break;
                }

                return profiles;
            }
        }
    }
}