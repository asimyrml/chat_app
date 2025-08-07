from channels.middleware import BaseMiddleware


class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        from urllib.parse import parse_qs
        from channels.db import database_sync_to_async
        from django.utils.functional import LazyObject
        from django.db import close_old_connections
        close_old_connections()

        # Lazy olarak import et
        from django.contrib.auth.models import AnonymousUser
        from rest_framework.authtoken.models import Token

        query_string = scope["query_string"].decode()
        params = parse_qs(query_string)
        token_key = params.get("token", [None])[0]

        if token_key:
            try:
                token = await database_sync_to_async(Token.objects.select_related('user').get)(key=token_key)
                scope["user"] = token.user
            except Token.DoesNotExist:
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
