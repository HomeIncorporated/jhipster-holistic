import 'dart:async';

import 'package:enterprise/account/login/login_repository.dart';
import 'package:enterprise/shared/bloc/bloc.dart';
import 'package:rxdart/rxdart.dart';

class EnterpriseDrawerBloc extends Bloc {
  final _signOut = BehaviorSubject<bool>();

  Stream<bool> get _signOutStream => _signOut.stream;

  LoginRepository loginRepository = new LoginRepository();

  Function(bool) get changeSignOut => _signOut.sink.add;

        EnterpriseDrawerBloc() {
    _signOut.listen((signOutData) => signOut());
  }

  signOut() async {
   await loginRepository.logout();
  }

  @override
  void dispose() => () {
        _signOut.close();
      };
}
